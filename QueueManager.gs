function enqueueSubmissionFromRow_(rowNumber, sheetName) {
  var sheet = getResponseSheet_(sheetName);
  if (rowNumber <= 1) {
    throw new Error('Select a response row, not the header row.');
  }

  var authorization = authorizeSubmissionRowOrBlock_(sheet, rowNumber);
  if (!authorization.authorized) {
    return {
      JobID: authorization.JobID || '',
      SubmissionID: authorization.SubmissionID || '',
      Status: authorization.Status
    };
  }

  setupOrUpgradeProject();

  var rowData = normalizeSubmissionData_(getRowData_(sheet, rowNumber));
  validateRequiredFields_(rowData);

  var submissionId = rowData.SubmissionID || makeSubmissionId_(rowNumber);
  var jobId = rowData.JobID || makeJobId_(submissionId);
  rowData.SubmissionID = submissionId;
  rowData.JobID = jobId;

  var support = getSupportStatus_(rowData);
  if (!support.supported) {
    return enqueueUnsupportedSubmission_(sheet, rowNumber, rowData, support.reason);
  }

  var bowRecords = getBowRecordsForTerm_(rowData.GradeLevel, rowData.Subject, rowData.Term);
  if (!bowRecords.length) {
    var noBowMessage = 'No BOW_DATABASE records found for ' + rowData.GradeLevel + ', ' + rowData.Subject + ', ' + rowData.Term + '.';
    writeOutputFields_(sheet, rowNumber, {
      SubmissionID: submissionId,
      JobID: jobId,
      ProcessingStatus: STATUS.FAILED,
      ErrorMessage: noBowMessage,
      LastUpdatedAt: now_()
    });
    logProcessing_(submissionId, jobId, STATUS.FAILED, noBowMessage, '');
    sendAdminFailureEmail_({
      JobID: jobId,
      SubmissionID: submissionId,
      TeacherEmail: rowData.TeacherEmail,
      GradeLevel: rowData.GradeLevel,
      Subject: rowData.Subject,
      Term: rowData.Term,
      CurrentPhase: 'BOW lookup failed',
      LastError: noBowMessage
    });
    return {
      JobID: jobId,
      SubmissionID: submissionId,
      Status: STATUS.FAILED,
      LastError: noBowMessage
    };
  }
  var calendar = resolveTermCalendar_(
    rowData.GradeLevel,
    rowData.Subject,
    rowData.Term,
    bowRecords
  );
  bowRecords = calendar.orderedBowRecords;
  var totalTeachingDays = calendar.totalTeachingDays;

  var outcome = withScriptLock_(function () {
    writeOutputFields_(sheet, rowNumber, {
      SubmissionID: submissionId,
      JobID: jobId,
      LastUpdatedAt: now_()
    });

    var activeDuplicate = findActiveDuplicateJob_(rowData);
    if (activeDuplicate) {
      var activeMessage = 'The same full-term request is already being processed. Existing status: ' + activeDuplicate.Status + '.';
      writeOutputFields_(sheet, rowNumber, {
        ProcessingStatus: STATUS.DUPLICATE_ACTIVE,
        DuplicateWarning: activeMessage,
        ErrorMessage: '',
        GeneratedDocID: activeDuplicate.GeneratedDocID || '',
        GeneratedDocLink: activeDuplicate.GeneratedDocLink || '',
        LastUpdatedAt: now_()
      });
      logProcessing_(submissionId, jobId, STATUS.DUPLICATE_ACTIVE, activeMessage, '');
      return {
        job: {
          JobID: jobId,
          SubmissionID: submissionId,
          Status: STATUS.DUPLICATE_ACTIVE,
          DuplicateWarning: activeMessage
        },
        duplicateJob: activeDuplicate,
        rowData: rowData,
        duplicateMessage: activeMessage,
        emailType: 'duplicate'
      };
    }

    var completedDuplicate = findCompletedDuplicate_(rowData);
    if (completedDuplicate) {
      var completedMessage = 'A completed full-term lesson plan already exists for this same teacher, school year, grade, section, subject, and term.';
      writeOutputFields_(sheet, rowNumber, {
        ProcessingStatus: STATUS.DUPLICATE_ACTIVE,
        DuplicateWarning: completedMessage,
        ErrorMessage: '',
        GeneratedDocLink: completedDuplicate.GeneratedDocLink || '',
        LastUpdatedAt: now_()
      });
      logProcessing_(submissionId, jobId, STATUS.DUPLICATE_ACTIVE, completedMessage, '');
      return {
        job: {
          JobID: jobId,
          SubmissionID: submissionId,
          Status: STATUS.DUPLICATE_ACTIVE,
          DuplicateWarning: completedMessage
        },
        duplicateJob: completedDuplicate,
        rowData: rowData,
        duplicateMessage: completedMessage,
        emailType: 'duplicate'
      };
    }

    var job = createQueueJob_(rowData, rowNumber, {
      Status: STATUS.QUEUED,
      CurrentPhase: 'Queued',
      TotalTeachingDays: totalTeachingDays,
      CalendarFingerprint: calendar.fingerprint,
      CurrentDay: 0,
      RetryCount: 0,
      QueuedEmailSent: 'No',
      CompletionEmailSent: 'No',
      UnsupportedEmailSent: ''
    });

    var queueSheet = getSheetByName_(SHEET_NAMES.GENERATION_QUEUE);
    var queueRowNumber = appendObjectRow_(queueSheet, QUEUE_HEADERS, job);
    job._rowNumber = queueRowNumber;

    var queuePosition = getQueuePosition_(job.JobID);
    writeOutputFields_(sheet, rowNumber, {
      ProcessingStatus: STATUS.QUEUED,
      QueuePosition: queuePosition,
      BOWCoverage: bowRecords.length + ' BOW record(s)',
      TotalTeachingDays: totalTeachingDays,
      CurrentDay: 0,
      ProgressPercent: '0%',
      DuplicateWarning: '',
      ErrorMessage: '',
      QueuedEmailSent: 'No',
      CompletionEmailSent: 'No',
      LastUpdatedAt: now_()
    });

    logProcessing_(submissionId, jobId, STATUS.QUEUED, 'Full-term request queued.', '');
    return {
      job: job,
      emailType: 'queued'
    };
  }, 10000);

  sendPostEnqueueEmail_(outcome, sheet, rowNumber);
  return outcome.job;
}

function enqueueUnsupportedSubmission_(sheet, rowNumber, rowData, reason) {
  var unsupportedJob = createQueueJob_(rowData, rowNumber, {
    Status: STATUS.UNSUPPORTED,
    CurrentPhase: 'Unsupported selection',
    TotalTeachingDays: '',
    UnsupportedReason: reason,
    UnsupportedEmailSent: 'No'
  });

  withScriptLock_(function () {
    writeOutputFields_(sheet, rowNumber, {
      SubmissionID: rowData.SubmissionID,
      JobID: rowData.JobID,
      ProcessingStatus: STATUS.UNSUPPORTED,
      ErrorMessage: reason,
      BOWCoverage: '',
      TotalTeachingDays: '',
      CurrentDay: '',
      ProgressPercent: '',
      LastUpdatedAt: now_()
    });
    appendObjectRow_(getSheetByName_(SHEET_NAMES.GENERATION_QUEUE), QUEUE_HEADERS, unsupportedJob);
    logProcessing_(rowData.SubmissionID, rowData.JobID, STATUS.UNSUPPORTED, reason, '');
  }, 10000);

  try {
    sendUnsupportedEmail_(unsupportedJob, reason);
    markUnsupportedEmailSent_(unsupportedJob.JobID);
  } catch (err) {
    logProcessing_(rowData.SubmissionID, rowData.JobID, 'EmailError', err && err.message ? err.message : String(err), err && err.stack ? err.stack : '');
  }

  return unsupportedJob;
}

function sendPostEnqueueEmail_(outcome, sheet, rowNumber) {
  if (!outcome || !outcome.emailType) {
    return;
  }

  try {
    if (outcome.emailType === 'queued') {
      sendQueuedEmail_(outcome.job);
      withScriptLock_(function () {
        var queueJob = getQueueJobByRow_(findQueueRowByJobId_(outcome.job.JobID));
        if (queueJob) {
          updateQueueJob_(queueJob, { QueuedEmailSent: 'Yes' });
        }
        writeOutputFields_(sheet, rowNumber, {
          QueuedEmailSent: 'Yes',
          LastUpdatedAt: now_()
        });
      }, 10000);
    } else if (outcome.emailType === 'duplicate') {
      sendDuplicateActiveEmail_(outcome.rowData, outcome.duplicateJob, outcome.duplicateMessage);
    }
  } catch (err) {
    logProcessing_(outcome.job.SubmissionID, outcome.job.JobID, 'EmailError', err && err.message ? err.message : String(err), err && err.stack ? err.stack : '');
  }
}

function createQueueJob_(rowData, rowNumber, overrides) {
  var createdAt = now_();
  var base = {
    JobID: rowData.JobID,
    SubmissionID: rowData.SubmissionID,
    FormResponseRow: rowNumber,
    TeacherName: rowData.TeacherName,
    TeacherEmail: rowData.TeacherEmail,
    SchoolName: rowData.SchoolName,
    SchoolYear: rowData.SchoolYear || 'Not specified',
    GradeLevel: rowData.GradeLevel,
    ClassSection: rowData.ClassSection || 'Not specified',
    Subject: rowData.Subject,
    Term: rowData.Term,
    TotalTeachingDays: '',
    CurrentDay: 0,
    Status: STATUS.QUEUED,
    CurrentPhase: 'Queued',
    GeneratedDocID: '',
    GeneratedDocLink: '',
    DuplicateWarning: '',
    RetryCount: 0,
    LastError: '',
    PlanningAttemptCount: 0,
    LastPlanningAttemptAt: '',
    NextRetryAt: '',
    LastPlanValidationError: '',
    FinalAssessmentStatus: '',
    FinalAssessmentAttemptCount: 0,
    FinalAssessmentGeneratedAt: '',
    FinalAssessmentLastError: '',
    WorkerLeaseToken: '',
    WorkerLeaseUntil: '',
    WorkerStartedAt: '',
    CreatedAt: createdAt,
    StartedAt: '',
    UpdatedAt: createdAt,
    CompletedAt: '',
    QueuedEmailSent: 'No',
    CompletionEmailSent: 'No',
    UnsupportedEmailSent: '',
    UnsupportedReason: '',
    ClassLearningAbility: rowData.ClassLearningAbility,
    LearnerContext: rowData.LearnerContext,
    AvailableMaterials: rowData.AvailableMaterials,
    PreferredTeachingStrategy: rowData.PreferredTeachingStrategy,
    SpecialInstructions: rowData.SpecialInstructions,
    PreferredLanguage: rowData.PreferredLanguage || 'English'
  };

  Object.keys(overrides || {}).forEach(function (key) {
    base[key] = overrides[key];
  });

  return base;
}

function getSupportStatus_(rowData) {
  var supportRows = getSupportMatrixRowsForSelection_(rowData.GradeLevel, rowData.Subject, rowData.Term);
  var selected = rowData.GradeLevel + ', ' + rowData.Subject + ', ' + rowData.Term;

  if (!supportRows.length) {
    return { supported: false, reason: 'This grade, subject, and term is not active in SUPPORT_MATRIX. Selected request: ' + selected + '.' };
  }

  if (supportRows.length > 1) {
    return { supported: false, reason: 'Multiple SUPPORT_MATRIX rows found for selected request: ' + selected + '. Ask an administrator to remove duplicates before processing.' };
  }

  var supportRow = supportRows[0];
  if (normalizeForMatch_(supportRow.Status) !== 'active') {
    return { supported: false, reason: 'Support status is not Active for selected request: ' + selected + '.' };
  }
  if (!isTruthyFlag_(supportRow.Active)) {
    return { supported: false, reason: 'SUPPORT_MATRIX Active is not Yes for selected request: ' + selected + '.' };
  }
  if (!isTruthyFlag_(supportRow.BOWComplete)) {
    return { supported: false, reason: 'SUPPORT_MATRIX BOWComplete is not Yes for selected request: ' + selected + '.' };
  }
  if (!isTruthyFlag_(supportRow.TeacherReviewed)) {
    return { supported: false, reason: 'SUPPORT_MATRIX TeacherReviewed is not Yes for selected request: ' + selected + '.' };
  }

  var promptProfile = String(supportRow.PromptProfile || '').trim();
  if (!promptProfile) {
    return { supported: false, reason: 'SUPPORT_MATRIX PromptProfile is blank for selected request: ' + selected + '.' };
  }

  var profileStatus = getSubjectProfileStatus_(promptProfile);
  if (!profileStatus.profile) {
    return { supported: false, reason: 'PromptProfile "' + promptProfile + '" was not found in SUBJECT_PROFILES for selected request: ' + selected + '.' };
  }
  if (profileStatus.duplicates > 1) {
    return { supported: false, reason: 'Multiple SUBJECT_PROFILES rows found for PromptProfile "' + promptProfile + '". Ask an administrator to remove duplicates before processing.' };
  }
  if (!isTruthyFlag_(profileStatus.profile.Active)) {
    return { supported: false, reason: 'PromptProfile "' + promptProfile + '" is not active in SUBJECT_PROFILES for selected request: ' + selected + '.' };
  }
  if (normalizeForMatch_(profileStatus.profile.Subject) !== normalizeForMatch_(supportRow.Subject)) {
    return { supported: false, reason: 'PromptProfile "' + promptProfile + '" subject does not match selected subject: ' + rowData.Subject + '.' };
  }

  return { supported: true, reason: '', supportRow: supportRow, promptProfile: profileStatus.profile };
}

function getSupportMatrixRowsForSelection_(gradeLevel, subject, term) {
  var targetKey = supportMatrixKey_(gradeLevel, subject, term);
  return getSheetObjects_(SHEET_NAMES.SUPPORT_MATRIX).filter(function (row) {
    return supportMatrixKey_(row.GradeLevel, row.Subject, row.Term) === targetKey;
  });
}

function getSubjectProfileStatus_(promptProfile) {
  var targetProfile = normalizeForMatch_(promptProfile);
  var matches = getSheetObjects_(SHEET_NAMES.SUBJECT_PROFILES).filter(function (row) {
    return normalizeForMatch_(row.PromptProfile) === targetProfile;
  });

  return {
    profile: matches.length ? matches[0] : null,
    duplicates: matches.length
  };
}

function findActiveDuplicateJob_(rowData) {
  var targetKey = duplicateKey_(rowData);
  var jobs = getSheetObjects_(SHEET_NAMES.GENERATION_QUEUE);

  for (var i = 0; i < jobs.length; i++) {
    var job = jobs[i];
    if (
      ACTIVE_QUEUE_STATUSES.indexOf(String(job.Status || '').trim()) !== -1 &&
      duplicateKey_(normalizeSubmissionData_(job)) === targetKey
    ) {
      return job;
    }
  }

  return null;
}

function findCompletedDuplicate_(rowData) {
  var targetKey = duplicateKey_(rowData);
  var histories = getSheetObjects_(SHEET_NAMES.GENERATED_HISTORY);

  for (var i = 0; i < histories.length; i++) {
    var history = normalizeSubmissionData_(histories[i]);
    if (duplicateKey_(history) === targetKey) {
      return histories[i];
    }
  }

  return null;
}

function getQueuePosition_(jobId) {
  var jobs = getSheetObjects_(SHEET_NAMES.GENERATION_QUEUE).filter(function (job) {
    return WORKER_ELIGIBLE_STATUSES.indexOf(String(job.Status || '').trim()) !== -1;
  }).sort(function (a, b) {
    return new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime();
  });

  for (var i = 0; i < jobs.length; i++) {
    if (String(jobs[i].JobID || '') === String(jobId || '')) {
      return i + 1;
    }
  }

  return '';
}

function markUnsupportedEmailSent_(jobId) {
  withScriptLock_(function () {
    var sheet = getSheetByName_(SHEET_NAMES.GENERATION_QUEUE);
    var rowNumber = findRowNumberByColumnValue_(sheet, 'JobID', jobId);
    if (rowNumber) {
      updateObjectRow_(sheet, rowNumber, {
        UnsupportedEmailSent: 'Yes',
        UpdatedAt: now_()
      });
    }
  }, 10000);
}
