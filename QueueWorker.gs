function processGenerationQueue() {
  if (hasActiveQueueWorkerLease_()) {
    Logger.log('Queue worker skipped because another worker lease is still active.');
    return;
  }

  var deadline = new Date().getTime() + (getWorkerRuntimeSeconds_() * 1000);
  var job = claimNextQueueJob_();
  if (!job) {
    return;
  }

  processOneQueueJob_(job, deadline);
}

function claimNextQueueJob_() {
  var configurationPauseJob = null;
  var result = tryWithScriptLock_(function () {
    while (true) {
      var job = findNextEligibleQueueJob_();
      if (!job) {
        return null;
      }

      if (hasActiveWorkerLease_(job)) {
        Logger.log('Queue worker skipped because job ' + job.JobID + ' is already leased.');
        return null;
      }

      var authorization = evaluateQueueJobAuthorization_(job);
      if (authorization.configurationUnavailable) {
        configurationPauseJob = job;
        return null;
      }
      if (!authorization.authorized) {
        blockQueueJobForAuthorization_(job, authorization);
        continue;
      }

      setupOrUpgradeProject();
      return claimQueueJobLease_(job);
    }
  }, 250);

  if (!result.acquired) {
    Logger.log('Queue worker skipped because the script lock is held by another execution.');
    return null;
  }

  if (configurationPauseJob) {
    logAuthorizationConfigurationPause_(configurationPauseJob, 'queue claim');
    return null;
  }

  return result.value;
}

function findNextEligibleQueueJob_() {
  var jobs = getSheetObjects_(SHEET_NAMES.GENERATION_QUEUE).filter(function (job) {
    return WORKER_ELIGIBLE_STATUSES.indexOf(String(job.Status || '').trim()) !== -1 &&
      !isRetryScheduledInFuture_(job);
  });

  if (!jobs.length) {
    return null;
  }

  var activeFirst = jobs.filter(function (job) {
    return String(job.Status || '') !== STATUS.QUEUED;
  }).sort(compareJobsForQueue_);

  if (activeFirst.length) {
    return activeFirst[0];
  }

  return jobs.sort(compareJobsForQueue_)[0];
}

function hasActiveQueueWorkerLease_() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(SHEET_NAMES.GENERATION_QUEUE);
    if (!sheet || sheet.getLastRow() < 2) {
      return false;
    }

    var jobs = getSheetObjects_(sheet);
    for (var i = 0; i < jobs.length; i++) {
      if (
        WORKER_ELIGIBLE_STATUSES.indexOf(String(jobs[i].Status || '').trim()) !== -1 &&
        hasActiveWorkerLease_(jobs[i])
      ) {
        Logger.log(
          'Active worker lease found for ' +
          (jobs[i].JobID || '(unknown job)') +
          ' until ' +
          jobs[i].WorkerLeaseUntil +
          '.'
        );
        return true;
      }
    }
  } catch (err) {
    Logger.log(
      'Queue worker active-lease guard could not read queue state; continuing to normal claim path. ' +
      (err && err.message ? err.message : String(err))
    );
  }

  return false;
}

function tryWithScriptLock_(callback, waitMs) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(waitMs || 0)) {
    return { acquired: false, value: null };
  }

  try {
    return { acquired: true, value: callback() };
  } finally {
    lock.releaseLock();
  }
}

function compareJobsForQueue_(a, b) {
  var aTime = new Date(a.CreatedAt || a.UpdatedAt || now_()).getTime();
  var bTime = new Date(b.CreatedAt || b.UpdatedAt || now_()).getTime();
  return aTime - bTime;
}

function claimQueueJobLease_(job) {
  var token = Utilities.getUuid();
  var leaseUntil = getWorkerLeaseUntil_();
  var sheet = getSheetByName_(SHEET_NAMES.GENERATION_QUEUE);
  var rowNumber = job._rowNumber || findQueueRowByJobId_(job.JobID);
  if (!rowNumber) {
    throw new Error('Could not find job to lease: ' + job.JobID + '.');
  }

  updateObjectRow_(sheet, rowNumber, {
    WorkerLeaseToken: token,
    WorkerLeaseUntil: leaseUntil,
    WorkerStartedAt: job.WorkerStartedAt || now_(),
    UpdatedAt: now_()
  });

  job._rowNumber = rowNumber;
  job._leaseToken = token;
  job.WorkerLeaseToken = token;
  job.WorkerLeaseUntil = leaseUntil;
  job.WorkerStartedAt = job.WorkerStartedAt || now_();
  return job;
}

function hasActiveWorkerLease_(job) {
  var token = String(job.WorkerLeaseToken || '').trim();
  if (!token) {
    return false;
  }

  var until = getDateValue_(job.WorkerLeaseUntil);
  return until && until.getTime() > now_().getTime();
}

function getWorkerLeaseUntil_() {
  return new Date(now_().getTime() + ((getWorkerRuntimeSeconds_() + 90) * 1000));
}

function renewWorkerLease_(job) {
  if (!job || !job._leaseToken) {
    throw createClassifiedError_('Worker lease token is missing for job ' + (job && job.JobID ? job.JobID : '') + '.', 'temporary');
  }

  return updateQueueJob_(job, {
    WorkerLeaseUntil: getWorkerLeaseUntil_()
  });
}

function verifyWorkerLease_(job) {
  if (!job || !job._leaseToken) {
    throw createClassifiedError_('Worker lease token is missing for job ' + (job && job.JobID ? job.JobID : '') + '.', 'temporary');
  }

  return withScriptLock_(function () {
    var current = getQueueJobByRow_(job._rowNumber || findQueueRowByJobId_(job.JobID));
    if (!current || String(current.WorkerLeaseToken || '') !== String(job._leaseToken || '')) {
      throw createClassifiedError_('Worker lease no longer owns job ' + job.JobID + '.', 'temporary');
    }
    return current;
  }, 5000);
}

function releaseWorkerLease_(job, updates) {
  updates = updates || {};
  updates.WorkerLeaseToken = '';
  updates.WorkerLeaseUntil = '';
  updates.WorkerStartedAt = '';
  return updateQueueJob_(job, updates);
}

function getDateValue_(value) {
  if (!value) {
    return null;
  }
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return value;
  }
  var date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

function processOneQueueJob_(job, deadline) {
  var authorization = evaluateQueueJobAuthorization_(job);
  if (authorization.configurationUnavailable) {
    releaseWorkerLease_(job, {});
    logAuthorizationConfigurationPause_(job, 'job processing');
    return;
  }
  if (!authorization.authorized) {
    blockQueueJobForAuthorization_(job, authorization);
    return;
  }

  var activeDay = null;
  try {
    renewWorkerLease_(job);
    var bowRecords = getBowRecordsForTerm_(job.GradeLevel, job.Subject, job.Term);
    if (!bowRecords.length) {
      failJobWithoutOpenAI_(job, 'No BOW_DATABASE records found for ' + job.GradeLevel + ', ' + job.Subject + ', ' + job.Term + '. OpenAI was not called.');
      return;
    }

    if (!job.GeneratedDocID) {
      var docInfo = createTermLessonPlanDocument_(job, bowRecords);
      renewWorkerLease_(job);
      updateQueueJob_(job, {
        GeneratedDocID: docInfo.docId,
        GeneratedDocLink: docInfo.docUrl,
        StartedAt: job.StartedAt || now_(),
        CurrentPhase: 'Document created'
      });
      updateFormResponseProgress_(job, {
        GeneratedDocID: docInfo.docId,
        GeneratedDocLink: docInfo.docUrl
      });
    }

    var termRows = ensureTermPlanForJob_(job);
    appendGeneratedContentsIndex_(job.GeneratedDocID, termRows);

    while (hasRuntimeForAnotherDay_(deadline)) {
      renewWorkerLease_(job);
      termRows = getTermDayRowsForJob_(job.JobID);
      var nextDay = findNextUnfinishedDay_(termRows);
      activeDay = nextDay;

      if (!nextDay) {
        completeQueueJob_(job, termRows);
        return;
      }

      if (isDayAlreadyInDocument_(job.GeneratedDocID, nextDay)) {
        markDayCompleted_(job, nextDay);
        activeDay = null;
        continue;
      }

      updateQueueJob_(job, {
        Status: STATUS.GENERATING,
        CurrentPhase: 'Generating Day ' + nextDay.DayNumber,
        LastError: ''
      });
      updateFormResponseProgress_(job, {
        ProcessingStatus: STATUS.GENERATING,
        ErrorMessage: ''
      });

      var lesson = generateDailyLessonForPlanRow_(job, nextDay, termRows);
      appendDailyLessonToDocument_(job.GeneratedDocID, job, nextDay, lesson);
      if (!isDayAlreadyInDocument_(job.GeneratedDocID, nextDay)) {
        throw createClassifiedError_('Day ' + nextDay.DayNumber + ' was appended without a completion marker.', 'validation');
      }
      markDayCompleted_(job, nextDay);
      activeDay = null;
      logProcessing_(job.SubmissionID, job.JobID, STATUS.GENERATING, 'Completed Day ' + nextDay.DayNumber + '.', '');
    }

    releaseWorkerLease_(job, {
      Status: STATUS.GENERATING,
      CurrentPhase: 'Paused before time limit',
      LastError: ''
    });
  } catch (err) {
    handleWorkerError_(job, err, activeDay);
  }
}

function hasRuntimeForAnotherDay_(deadline) {
  return new Date().getTime() + 45000 < deadline;
}

function findNextUnfinishedDay_(termRows) {
  for (var i = 0; i < termRows.length; i++) {
    if (String(termRows[i].Status || '') !== DAY_STATUS.COMPLETED) {
      return termRows[i];
    }
  }
  return null;
}

function markDayCompleted_(job, dayRow) {
  renewWorkerLease_(job);
  updateTermDayRow_(dayRow, {
    Status: DAY_STATUS.COMPLETED,
    GeneratedAt: now_(),
    LastError: ''
  });

  var currentDay = Number(dayRow.DayNumber);
  var progress = Math.round((currentDay / Number(job.TotalTeachingDays)) * 100);
  updateQueueJob_(job, {
    Status: STATUS.GENERATING,
    CurrentPhase: 'Completed Day ' + currentDay,
    CurrentDay: currentDay,
    RetryCount: 0,
    LastError: ''
  });
  updateFormResponseProgress_(job, {
    ProcessingStatus: STATUS.GENERATING,
    CurrentDay: currentDay,
    ProgressPercent: progress + '%',
    ErrorMessage: ''
  });
}

function completeQueueJob_(job, termRows) {
  renewWorkerLease_(job);
  verifyCompletedTermDocument_(job, termRows);
  ensureFinalAssessmentForJob_(job, termRows);
  renewWorkerLease_(job);
  appendTermClosingSections_(job.GeneratedDocID, job);
  removeInternalMarkersFromDoc_(job.GeneratedDocID);
  shareDocumentWithTeacher_(job.GeneratedDocID, job.TeacherEmail);
  if (String(job.CompletionEmailSent || '') !== 'Yes') {
    sendCompletionEmail_(job);
    job.CompletionEmailSent = 'Yes';
  }

  var completedAt = now_();
  releaseWorkerLease_(job, {
    Status: STATUS.COMPLETED,
    CurrentPhase: 'Completed',
    CurrentDay: job.TotalTeachingDays,
    CompletedAt: completedAt,
    CompletionEmailSent: 'Yes',
    LastError: ''
  });
  updateFormResponseProgress_(job, {
    ProcessingStatus: STATUS.COMPLETED,
    CurrentDay: job.TotalTeachingDays,
    ProgressPercent: '100%',
    GeneratedDocID: job.GeneratedDocID,
    GeneratedDocLink: job.GeneratedDocLink,
    ErrorMessage: '',
    CompletionEmailSent: 'Yes',
    ProcessedAt: completedAt
  });

  if (!hasGeneratedHistoryForJob_(job.JobID)) {
    appendGeneratedHistory_(job);
  }
  logProcessing_(job.SubmissionID, job.JobID, STATUS.COMPLETED, 'Full-term lesson plan completed and emailed.', '');
}

function handleWorkerError_(job, err, activeDay) {
  if (err && err.workerHandled) {
    logProcessing_(job.SubmissionID, job.JobID, 'WorkerHandled', err.message || String(err), err.stack || '');
    return;
  }

  var message = err && err.message ? err.message : String(err);
  var raw = err && err.stack ? err.stack : '';
  var retryCount = Number(job.RetryCount || 0);

  try {
    verifyWorkerLease_(job);
  } catch (leaseErr) {
    logProcessing_(job.SubmissionID, job.JobID, 'LeaseLost', leaseErr && leaseErr.message ? leaseErr.message : String(leaseErr), leaseErr && leaseErr.stack ? leaseErr.stack : '');
    return;
  }

  if (activeDay && activeDay._rowNumber) {
    updateTermDayRow_(activeDay, {
      Status: DAY_STATUS.FAILED,
      LastError: truncate_(message, 45000)
    });
  }

  if (isAdminOpenAIError_(err)) {
    releaseWorkerLease_(job, {
      Status: STATUS.WAITING_FOR_ADMIN,
      CurrentPhase: 'Waiting for admin',
      LastError: truncate_(message, 45000)
    });
    updateFormResponseProgress_(job, {
      ProcessingStatus: STATUS.WAITING_FOR_ADMIN,
      ErrorMessage: truncate_(message, 45000)
    });
    logProcessing_(job.SubmissionID, job.JobID, STATUS.WAITING_FOR_ADMIN, message, raw);
    sendAdminFailureEmail_(job);
    return;
  }

  retryCount += 1;
  if (retryCount >= getMaxRetries_()) {
    releaseWorkerLease_(job, {
      Status: STATUS.FAILED,
      CurrentPhase: 'Failed after max retries',
      RetryCount: retryCount,
      LastError: truncate_(message, 45000)
    });
    updateFormResponseProgress_(job, {
      ProcessingStatus: STATUS.FAILED,
      ErrorMessage: truncate_(message, 45000)
    });
    logProcessing_(job.SubmissionID, job.JobID, STATUS.FAILED, message, raw);
    sendAdminFailureEmail_(job);
    return;
  }

  releaseWorkerLease_(job, {
    Status: STATUS.WAITING_FOR_RETRY,
    CurrentPhase: 'Waiting for retry',
    RetryCount: retryCount,
    LastError: truncate_(message, 45000)
  });
  updateFormResponseProgress_(job, {
    ProcessingStatus: STATUS.WAITING_FOR_RETRY,
    ErrorMessage: truncate_(message, 45000)
  });
  logProcessing_(job.SubmissionID, job.JobID, STATUS.WAITING_FOR_RETRY, message, raw);
}

function failJobWithoutOpenAI_(job, message) {
  releaseWorkerLease_(job, {
    Status: STATUS.FAILED,
    CurrentPhase: 'BOW lookup failed',
    LastError: message
  });
  updateFormResponseProgress_(job, {
    ProcessingStatus: STATUS.FAILED,
    ErrorMessage: message
  });
  logProcessing_(job.SubmissionID, job.JobID, STATUS.FAILED, message, '');
  sendAdminFailureEmail_(job);
}
