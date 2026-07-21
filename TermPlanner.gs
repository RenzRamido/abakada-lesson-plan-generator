function ensureTermPlanForJob_(job) {
  var bowRecords = getBowRecordsForTerm_(job.GradeLevel, job.Subject, job.Term);
  if (!bowRecords.length) {
    throw createClassifiedError_('No BOW_DATABASE records found for ' + job.GradeLevel + ', ' + job.Subject + ', ' + job.Term + '. OpenAI was not called.', 'validation');
  }
  var calendar = resolveTermCalendar_(job.GradeLevel, job.Subject, job.Term, bowRecords);
  assertJobCalendarSnapshot_(job, calendar);
  bowRecords = calendar.orderedBowRecords;

  var storedPlan = validateStoredTermPlanForJob_(job, bowRecords);
  if (storedPlan.valid) {
    logProcessing_(job.SubmissionID, job.JobID, STATUS.PLANNING, 'Accepted existing complete TERM_DAY_PLAN with ' + storedPlan.rows.length + ' rows.', '');
    return storedPlan.rows;
  }

  if (storedPlan.rows.length) {
    logProcessing_(job.SubmissionID, job.JobID, STATUS.PLAN_VALIDATION_FAILED, 'Removed invalid or partial TERM_DAY_PLAN rows for this job only: ' + storedPlan.reason, '');
    deleteTermPlanRowsForJob_(job.JobID);
    updateQueueJob_(job, {
      Status: STATUS.PLANNING,
      CurrentPhase: 'Planning rescheduled after partial plan cleanup',
      LastPlanValidationError: truncate_(storedPlan.reason, 45000),
      LastError: truncate_(storedPlan.reason, 45000)
    });
    updateFormResponseProgress_(job, {
      ProcessingStatus: STATUS.PLANNING,
      ErrorMessage: truncate_(storedPlan.reason, 45000)
    });
  } else {
    logProcessing_(job.SubmissionID, job.JobID, STATUS.PLANNING, 'No stored TERM_DAY_PLAN found; planning scheduled.', '');
  }

  if (isRetryScheduledInFuture_(job)) {
    releaseWorkerLease_(job, {
      Status: STATUS.WAITING_FOR_RETRY,
      CurrentPhase: 'Waiting for scheduled planning retry',
      LastError: job.LastPlanValidationError || job.LastError || ''
    });
    throw createWorkerHandledError_('Planning retry is scheduled for ' + job.NextRetryAt + '.');
  }

  updateQueueJob_(job, {
    Status: STATUS.PLANNING,
    CurrentPhase: 'Planning term days',
    StartedAt: job.StartedAt || now_(),
    LastError: ''
  });
  updateFormResponseProgress_(job, {
    ProcessingStatus: STATUS.PLANNING,
    ErrorMessage: ''
  });

  try {
    var termRows = createTermPlanSingleAttempt_(job, bowRecords, calendar);
    if (job._leaseToken) {
      renewWorkerLease_(job);
    }
    writeTermPlanRows_(termRows);

    updateQueueJob_(job, {
      Status: STATUS.GENERATING,
      CurrentPhase: 'Generating daily lessons',
      RetryCount: 0,
      PlanningAttemptCount: 0,
      LastPlanningAttemptAt: now_(),
      NextRetryAt: '',
      LastPlanValidationError: '',
      LastError: ''
    });
    updateFormResponseProgress_(job, {
      ProcessingStatus: STATUS.GENERATING,
      BOWCoverage: bowRecords.length + ' BOW record(s)',
      ErrorMessage: ''
    });

    logProcessing_(job.SubmissionID, job.JobID, STATUS.PLANNING, 'Validated and saved ' + termRows.length + ' term day rows.', '');
    return getTermDayRowsForJob_(job.JobID);
  } catch (err) {
    recordPlanningAttemptFailure_(job, err);
  }
}

function createTermPlanSingleAttempt_(job, bowRecords, calendar) {
  calendar = calendar || resolveTermCalendar_(job.GradeLevel, job.Subject, job.Term, bowRecords);
  if (calendar.mode === 'official_fixed') {
    return createOfficialFixedTermPlanSingleAttempt_(job, calendar);
  }

  var totalDays = Number(job.TotalTeachingDays || getTermDayCount_(job.Term));
  if (bowRecords.length > totalDays) {
    return createDenseTermPlanSingleAttempt_(job, bowRecords, totalDays);
  }

  var promptRequest = buildTermPlanningPrompt_(job, bowRecords);
  var plan = callOpenAIJson_(promptRequest);
  try {
    return validateTermPlan_(plan, job, bowRecords);
  } catch (err) {
    var diagnostics = err && err.termPlanDiagnostics;
    if (!diagnostics || !diagnostics.coverageOnly || !diagnostics.missingBowIds.length) {
      throw err;
    }

    var repair = buildFeasibleCoverageRepair_(plan.days, bowRecords, totalDays);
    if (!repair.changedDayNumbers.length) {
      throw err;
    }

    if (job._leaseToken) {
      renewWorkerLease_(job);
    }
    var repairRequest = buildTermPlanMetadataRepairPrompt_(
      job,
      plan.days,
      repair.groups,
      repair.changedDayNumbers,
      bowRecords,
      diagnostics.missingBowIds
    );
    var repairedMetadata = callOpenAIJson_(repairRequest);
    if (job._leaseToken) {
      renewWorkerLease_(job);
    }
    var repairedPlan = mergeLockedCoverageMetadata_(
      plan.days,
      repairedMetadata,
      repair.groups,
      repair.changedDayNumbers
    );
    return validateTermPlan_(repairedPlan, job, bowRecords);
  }
}

function createOfficialFixedTermPlanSingleAttempt_(job, calendar) {
  var coverageGroups = buildOfficialFixedCoverageGroups_(calendar);
  var targetDayNumbers = coverageGroups.map(function (group) {
    return group.dayNumber;
  });
  var promptRequest = buildDenseTermPlanningPrompt_(
    job,
    calendar.orderedBowRecords,
    coverageGroups
  );
  var metadataPlan = callOpenAIJson_(promptRequest);
  if (job._leaseToken) {
    renewWorkerLease_(job);
  }
  var lockedPlan = mergeLockedCoverageMetadata_(
    [],
    metadataPlan,
    coverageGroups,
    targetDayNumbers
  );
  return validateTermPlan_(lockedPlan, job, calendar.orderedBowRecords);
}

function createDenseTermPlanSingleAttempt_(job, bowRecords, totalDays) {
  var coverageGroups = buildDenseBowCoverageGroups_(bowRecords, totalDays);
  var targetDayNumbers = coverageGroups.map(function (group) {
    return group.dayNumber;
  });
  var promptRequest = buildDenseTermPlanningPrompt_(job, bowRecords, coverageGroups);
  var metadataPlan = callOpenAIJson_(promptRequest);
  if (job._leaseToken) {
    renewWorkerLease_(job);
  }
  var lockedPlan = mergeLockedCoverageMetadata_(
    [],
    metadataPlan,
    coverageGroups,
    targetDayNumbers
  );
  return validateTermPlan_(lockedPlan, job, bowRecords);
}

function recordPlanningAttemptFailure_(job, err) {
  var message = err && err.message ? err.message : String(err);
  var raw = err && err.stack ? err.stack : '';
  var attemptCount = Number(job.PlanningAttemptCount || 0) + 1;
  var maxRetries = getMaxRetries_();
  var baseUpdates = {
    PlanningAttemptCount: attemptCount,
    LastPlanningAttemptAt: now_(),
    LastPlanValidationError: truncate_(message, 45000),
    LastError: truncate_(message, 45000)
  };

  logProcessing_(job.SubmissionID, job.JobID, STATUS.PLAN_VALIDATION_FAILED, 'Planning attempt ' + attemptCount + ' failed: ' + message, raw);

  if (isAdminOpenAIError_(err)) {
    releaseWorkerLease_(job, mergeObjects_(baseUpdates, {
      Status: STATUS.WAITING_FOR_ADMIN,
      CurrentPhase: 'Waiting for admin: term planning',
      NextRetryAt: ''
    }));
    updateFormResponseProgress_(job, {
      ProcessingStatus: STATUS.WAITING_FOR_ADMIN,
      ErrorMessage: truncate_(message, 45000)
    });
    sendAdminFailureEmail_(job);
    throw createWorkerHandledError_('Planning requires admin attention: ' + message);
  }

  if (attemptCount >= maxRetries) {
    releaseWorkerLease_(job, mergeObjects_(baseUpdates, {
      Status: STATUS.FAILED,
      CurrentPhase: 'Term planning failed after max retries',
      NextRetryAt: ''
    }));
    updateFormResponseProgress_(job, {
      ProcessingStatus: STATUS.FAILED,
      ErrorMessage: truncate_(message, 45000)
    });
    sendAdminFailureEmail_(job);
    throw createWorkerHandledError_('Term planning failed after max retries: ' + message);
  }

  var nextRetryAt = getNextRetryAt_();
  releaseWorkerLease_(job, mergeObjects_(baseUpdates, {
    Status: STATUS.WAITING_FOR_RETRY,
    CurrentPhase: 'Waiting for planning retry',
    NextRetryAt: nextRetryAt
  }));
  updateFormResponseProgress_(job, {
    ProcessingStatus: STATUS.WAITING_FOR_RETRY,
    ErrorMessage: truncate_(message, 45000)
  });
  throw createWorkerHandledError_('Planning attempt recorded and scheduled for retry: ' + message);
}

function writeTermPlanRows_(termRows) {
  var sheet = getSheetByName_(SHEET_NAMES.TERM_DAY_PLAN);
  appendMissingHeaders_(sheet, TERM_DAY_PLAN_HEADERS);

  termRows.forEach(function (row) {
    appendObjectRow_(sheet, TERM_DAY_PLAN_HEADERS, row);
  });
}

function deleteTermPlanRowsForJob_(jobId) {
  return withScriptLock_(function () {
    var sheet = getSheetByName_(SHEET_NAMES.TERM_DAY_PLAN);
    appendMissingHeaders_(sheet, TERM_DAY_PLAN_HEADERS);
    var headers = getHeaderMap_(sheet);
    var jobIdColumn = headers.JobID;
    if (!jobIdColumn || sheet.getLastRow() < 2) {
      return 0;
    }

    var deleted = 0;
    for (var r = sheet.getLastRow(); r >= 2; r--) {
      if (String(sheet.getRange(r, jobIdColumn).getValue() || '') === String(jobId || '')) {
        sheet.deleteRow(r);
        deleted += 1;
      }
    }
    return deleted;
  }, 10000);
}

function isRetryScheduledInFuture_(job) {
  var retryAt = getDateValue_(job.NextRetryAt);
  return retryAt && retryAt.getTime() > now_().getTime();
}

function mergeObjects_(base, extra) {
  var result = {};
  Object.keys(base || {}).forEach(function (key) {
    result[key] = base[key];
  });
  Object.keys(extra || {}).forEach(function (key) {
    result[key] = extra[key];
  });
  return result;
}
