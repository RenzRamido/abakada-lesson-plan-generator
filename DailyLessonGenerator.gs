function generateDailyLessonForPlanRow_(job, dayPlan, allDayRows) {
  var termBowRecords = getBowRecordsForTerm_(job.GradeLevel, job.Subject, job.Term);
  var coveredBowRecords = getCoveredBowRecordsForDay_(dayPlan, termBowRecords);
  if (!coveredBowRecords.length) {
    throw createClassifiedError_('No selected-term BOW_DATABASE records are locked for Day ' + dayPlan.DayNumber + '.', 'validation');
  }

  var previousSummary = getPreviousDaySummary_(dayPlan, allDayRows);
  var nextDayPlan = getNextDayPlan_(dayPlan, allDayRows);
  var promptRequest = buildDailyLessonPrompt_(job, dayPlan, coveredBowRecords, previousSummary, nextDayPlan);
  var lesson = callOpenAIJson_(promptRequest);
  validateDailyLesson_(lesson, dayPlan);
  lesson._coveredBowRecords = coveredBowRecords;
  return lesson;
}

function validateDailyLesson_(lesson, dayPlan) {
  if (!lesson || typeof lesson !== 'object') {
    throw createClassifiedError_('Daily lesson response is empty or not an object.', 'validation');
  }
  if (Number(lesson.dayNumber) !== Number(dayPlan.DayNumber)) {
    throw createClassifiedError_('Daily lesson day number mismatch. Expected ' + dayPlan.DayNumber + ', received ' + lesson.dayNumber + '.', 'validation');
  }
  if (
    Object.prototype.hasOwnProperty.call(lesson, 'bowId') ||
    Object.prototype.hasOwnProperty.call(lesson, 'bowWeek') ||
    Object.prototype.hasOwnProperty.call(lesson, 'domain') ||
    Object.prototype.hasOwnProperty.call(lesson, 'learningCompetency')
  ) {
    throw createClassifiedError_('Daily lesson returned official BOW fields. Official fields must come only from BOW_DATABASE for Day ' + dayPlan.DayNumber + '.', 'validation');
  }
  if (!String(lesson.lessonTitle || '').trim()) {
    throw createClassifiedError_('Daily lesson title is empty for Day ' + dayPlan.DayNumber + '.', 'validation');
  }
  if (!Array.isArray(lesson.learningObjectives) || !lesson.learningObjectives.length) {
    throw createClassifiedError_('Daily lesson objectives are missing for Day ' + dayPlan.DayNumber + '.', 'validation');
  }
  if (!Array.isArray(lesson.learningFlow) || !lesson.learningFlow.length) {
    throw createClassifiedError_('Daily lesson learning flow is missing for Day ' + dayPlan.DayNumber + '.', 'validation');
  }
  validateEstimatedTimes_(lesson.learningFlow, dayPlan);
  if (String(lesson.timeAdjustmentNote || '').trim() !== getTimeAdjustmentNote_()) {
    throw createClassifiedError_('Daily lesson time adjustment note is missing or incorrect for Day ' + dayPlan.DayNumber + '.', 'validation');
  }
  if (!lesson.formativeAssessment || !Array.isArray(lesson.formativeAssessment.items)) {
    throw createClassifiedError_('Daily lesson formative assessment is missing for Day ' + dayPlan.DayNumber + '.', 'validation');
  }

  var serialized = JSON.stringify(lesson);
  if (containsUnwantedFooterText_(serialized)) {
    throw createClassifiedError_('Daily lesson contains unwanted footer text for Day ' + dayPlan.DayNumber + '.', 'validation');
  }
}

function validateEstimatedTimes_(learningFlow, dayPlan) {
  var parsedMinuteTotal = 0;
  var parsedCount = 0;

  learningFlow.forEach(function (step, index) {
    var estimatedTime = String(step.estimatedTime || '').trim();
    if (!estimatedTime) {
      throw createClassifiedError_('Daily lesson estimated time is missing for Day ' + dayPlan.DayNumber + ', flow step ' + (index + 1) + '.', 'validation');
    }

    var minutes = extractEstimatedMinutes_(estimatedTime);
    if (minutes !== null) {
      if (minutes <= 0 || minutes > 120) {
        throw createClassifiedError_('Daily lesson estimated time is unreasonable for Day ' + dayPlan.DayNumber + ', flow step ' + (index + 1) + ': ' + estimatedTime + '.', 'validation');
      }
      parsedMinuteTotal += minutes;
      parsedCount += 1;
    }
  });

  if (parsedCount === learningFlow.length && (parsedMinuteTotal < 15 || parsedMinuteTotal > 240)) {
    throw createClassifiedError_('Daily lesson total estimated time appears unreasonable for Day ' + dayPlan.DayNumber + ': about ' + parsedMinuteTotal + ' minutes.', 'validation');
  }
}

function extractEstimatedMinutes_(value) {
  var text = String(value || '').toLowerCase();
  var rangeMatch = text.match(/(\d+(?:\.\d+)?)\s*[-\u2013]\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    return (Number(rangeMatch[1]) + Number(rangeMatch[2])) / 2;
  }

  var numberMatch = text.match(/(\d+(?:\.\d+)?)/);
  return numberMatch ? Number(numberMatch[1]) : null;
}

function getTimeAdjustmentNote_() {
  return 'Estimated times may be adjusted based on the school\'s actual class schedule.';
}

function getPreviousDaySummary_(dayPlan, allDayRows) {
  var previousDayNumber = Number(dayPlan.DayNumber) - 1;
  if (previousDayNumber < 1) {
    return '';
  }

  for (var i = 0; i < allDayRows.length; i++) {
    if (Number(allDayRows[i].DayNumber) === previousDayNumber) {
      return 'Previous planned day was ' + allDayRows[i].LessonTitle + ' (' + allDayRows[i].DayType + '): ' + allDayRows[i].ShortPurpose;
    }
  }

  return '';
}

function getNextDayPlan_(dayPlan, allDayRows) {
  var nextDayNumber = Number(dayPlan.DayNumber) + 1;
  for (var i = 0; i < allDayRows.length; i++) {
    if (Number(allDayRows[i].DayNumber) === nextDayNumber) {
      return allDayRows[i];
    }
  }

  return null;
}

function ensureFinalAssessmentForJob_(job, termRows) {
  if (!job.GeneratedDocID) {
    throw createClassifiedError_('GeneratedDocID is missing before final assessment generation.', 'validation');
  }

  if (isFinalAssessmentAlreadyInDocument_(job.GeneratedDocID)) {
    updateQueueJob_(job, {
      FinalAssessmentStatus: 'Completed',
      FinalAssessmentGeneratedAt: job.FinalAssessmentGeneratedAt || now_(),
      FinalAssessmentLastError: '',
      LastError: ''
    });
    logProcessing_(job.SubmissionID, job.JobID, STATUS.GENERATING_FINAL_ASSESSMENT, 'Final assessment COMPLETE marker already exists; queue state reconciled.', '');
    return;
  }

  if (String(job.FinalAssessmentStatus || '') === 'Completed' && isFinalAssessmentSectionPresent_(job.GeneratedDocID)) {
    logProcessing_(job.SubmissionID, job.JobID, STATUS.GENERATING_FINAL_ASSESSMENT, 'Final assessment section exists after marker cleanup; queue state accepted.', '');
    return;
  }

  if (isRetryScheduledInFuture_(job)) {
    releaseWorkerLease_(job, {
      Status: STATUS.WAITING_FOR_RETRY,
      CurrentPhase: 'Waiting for scheduled final assessment retry',
      LastError: job.FinalAssessmentLastError || job.LastError || ''
    });
    throw createWorkerHandledError_('Final assessment retry is scheduled for ' + job.NextRetryAt + '.');
  }

  updateQueueJob_(job, {
    Status: STATUS.GENERATING_FINAL_ASSESSMENT,
    CurrentPhase: 'Generating final assessment',
    FinalAssessmentStatus: 'Generating',
    LastError: ''
  });
  updateFormResponseProgress_(job, {
    ProcessingStatus: STATUS.GENERATING_FINAL_ASSESSMENT,
    ErrorMessage: ''
  });

  try {
    var bowRecords = getBowRecordsForTerm_(job.GradeLevel, job.Subject, job.Term);
    var promptRequest = buildFinalAssessmentPrompt_(job, bowRecords);
    var assessment = callOpenAIJson_(promptRequest);
    validateFinalAssessment_(assessment, job, bowRecords, termRows);
    appendFinalAssessmentToDocument_(job.GeneratedDocID, job, assessment);
    if (!isFinalAssessmentAlreadyInDocument_(job.GeneratedDocID)) {
      throw createClassifiedError_('Final assessment was appended without a completion marker.', 'validation');
    }

    updateQueueJob_(job, {
      Status: STATUS.GENERATING,
      CurrentPhase: 'Final assessment completed',
      FinalAssessmentStatus: 'Completed',
      FinalAssessmentGeneratedAt: now_(),
      FinalAssessmentLastError: '',
      FinalAssessmentAttemptCount: Number(job.FinalAssessmentAttemptCount || 0) + 1,
      NextRetryAt: '',
      LastError: ''
    });
    updateFormResponseProgress_(job, {
      ProcessingStatus: STATUS.GENERATING,
      ErrorMessage: ''
    });
    logProcessing_(job.SubmissionID, job.JobID, STATUS.GENERATING_FINAL_ASSESSMENT, 'Final assessment generated and appended.', '');
  } catch (err) {
    recordFinalAssessmentFailure_(job, err);
  }
}

function validateFinalAssessment_(assessment, job, bowRecords, termRows) {
  if (!assessment || typeof assessment !== 'object') {
    throw createClassifiedError_('Final assessment response is empty or not an object.', 'validation');
  }
  if (!String(assessment.assessmentTitle || '').trim()) {
    throw createClassifiedError_('Final assessment title is missing.', 'validation');
  }
  if (!String(assessment.directions || '').trim()) {
    throw createClassifiedError_('Final assessment directions are missing.', 'validation');
  }
  if (!assessment.writtenAssessment || !Array.isArray(assessment.writtenAssessment.items) || assessment.writtenAssessment.items.length < 5) {
    throw createClassifiedError_('Final assessment must include varied written items.', 'validation');
  }
  if (!Array.isArray(assessment.writtenAssessment.answerKey) || !assessment.writtenAssessment.answerKey.length) {
    throw createClassifiedError_('Final assessment answer key is missing.', 'validation');
  }
  if (!assessment.performanceTask || !Array.isArray(assessment.performanceTask.criteria) || !assessment.performanceTask.criteria.length) {
    throw createClassifiedError_('Final assessment performance/application task is missing.', 'validation');
  }

  var serialized = JSON.stringify(assessment);
  if (containsUnwantedFooterText_(serialized)) {
    throw createClassifiedError_('Final assessment contains unwanted footer text.', 'validation');
  }
  if (normalizeForMatch_(serialized).indexOf('learners completed') !== -1 || normalizeForMatch_(serialized).indexOf('students completed') !== -1) {
    throw createClassifiedError_('Final assessment must not claim learners completed the assessment.', 'validation');
  }
}

function recordFinalAssessmentFailure_(job, err) {
  var message = err && err.message ? err.message : String(err);
  var raw = err && err.stack ? err.stack : '';
  var attemptCount = Number(job.FinalAssessmentAttemptCount || 0) + 1;
  var maxRetries = getMaxRetries_();
  var baseUpdates = {
    FinalAssessmentStatus: 'FailedAttempt',
    FinalAssessmentAttemptCount: attemptCount,
    FinalAssessmentLastError: truncate_(message, 45000),
    LastError: truncate_(message, 45000)
  };

  logProcessing_(job.SubmissionID, job.JobID, STATUS.GENERATING_FINAL_ASSESSMENT, 'Final assessment attempt ' + attemptCount + ' failed: ' + message, raw);

  if (isAdminOpenAIError_(err)) {
    releaseWorkerLease_(job, mergeObjects_(baseUpdates, {
      Status: STATUS.WAITING_FOR_ADMIN,
      CurrentPhase: 'Waiting for admin: final assessment',
      NextRetryAt: ''
    }));
    updateFormResponseProgress_(job, {
      ProcessingStatus: STATUS.WAITING_FOR_ADMIN,
      ErrorMessage: truncate_(message, 45000)
    });
    sendAdminFailureEmail_(job);
    throw createWorkerHandledError_('Final assessment requires admin attention: ' + message);
  }

  if (attemptCount >= maxRetries) {
    releaseWorkerLease_(job, mergeObjects_(baseUpdates, {
      Status: STATUS.FAILED,
      CurrentPhase: 'Final assessment failed after max retries',
      NextRetryAt: ''
    }));
    updateFormResponseProgress_(job, {
      ProcessingStatus: STATUS.FAILED,
      ErrorMessage: truncate_(message, 45000)
    });
    sendAdminFailureEmail_(job);
    throw createWorkerHandledError_('Final assessment failed after max retries: ' + message);
  }

  var nextRetryAt = getNextRetryAt_();
  releaseWorkerLease_(job, mergeObjects_(baseUpdates, {
    Status: STATUS.WAITING_FOR_RETRY,
    CurrentPhase: 'Waiting for final assessment retry',
    NextRetryAt: nextRetryAt
  }));
  updateFormResponseProgress_(job, {
    ProcessingStatus: STATUS.WAITING_FOR_RETRY,
    ErrorMessage: truncate_(message, 45000)
  });
  throw createWorkerHandledError_('Final assessment attempt recorded and scheduled for retry: ' + message);
}
