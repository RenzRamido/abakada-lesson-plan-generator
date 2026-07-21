function validateTermPlan_(plan, job, bowRecords) {
  if (!plan || !Array.isArray(plan.days)) {
    var shapeError = createClassifiedError_('Term plan JSON must contain a days array.', 'validation');
    shapeError.termPlanDiagnostics = {
      coverageOnly: false,
      missingBowIds: (bowRecords || []).map(function (record) { return record.BOW_ID; }),
      errors: ['Term plan JSON must contain a days array.']
    };
    throw shapeError;
  }

  return validateTermPlanDays_(plan.days, job, bowRecords, false);
}

function validateStoredTermPlanForJob_(job, bowRecords) {
  var existingRows = getTermDayRowsForJob_(job.JobID);
  if (!existingRows.length) {
    return {
      valid: false,
      category: 'missing',
      reason: 'No stored TERM_DAY_PLAN rows exist for job ' + job.JobID + '.',
      rows: []
    };
  }

  try {
    var normalizedRows = validateTermPlanDays_(existingRows, job, bowRecords, true);
    return {
      valid: true,
      category: 'accepted',
      reason: 'Stored TERM_DAY_PLAN rows are complete and valid.',
      rows: normalizedRows
    };
  } catch (err) {
    return {
      valid: false,
      category: 'invalid',
      reason: err && err.message ? err.message : String(err),
      rows: existingRows
    };
  }
}

function validateTermPlanDays_(days, job, bowRecords, storedRows) {
  var calendar = resolveTermCalendar_(job.GradeLevel, job.Subject, job.Term, bowRecords);
  assertJobCalendarSnapshot_(job, calendar);
  bowRecords = calendar.orderedBowRecords;
  var expectedDays = Number(job.TotalTeachingDays || getTermDayCount_(job.Term));
  var bowMap = buildBowMapForTerm_(bowRecords);
  var seenDays = {};
  var representedBowIds = {};
  var representedBowDayCounts = {};
  var previousBowOrder = -1;
  var previousBowId = '';
  var previousDayNumber = 0;
  var normalizedRows = [];
  var validationErrors = [];

  function addError(code, message) {
    validationErrors.push({ code: code, message: message });
  }

  if (days.length !== expectedDays) {
    addError('shape', 'Term plan day count mismatch. Expected ' + expectedDays + ', received ' + days.length + '.');
  }

  days.forEach(function (day, index) {
    var expectedDayNumber = index + 1;
    var dayNumber = Number(storedRows ? day.DayNumber : day.dayNumber);
    var bowId = String(storedRows ? day.BOW_ID : day.bowId || '').trim();
    var bowEntry = bowMap[bowId];
    var coveredBowIds = [];

    if (dayNumber !== expectedDayNumber) {
      addError('shape', 'Term plan day numbers must be sequential. Expected Day ' + expectedDayNumber + ', received Day ' + (storedRows ? day.DayNumber : day.dayNumber) + '.');
    }
    if (seenDays[dayNumber]) {
      addError('shape', 'Term plan contains duplicate Day ' + dayNumber + '.');
    }
    seenDays[dayNumber] = true;
    if (!bowEntry) {
      addError('unsupported', 'Term plan references unsupported BOW_ID for selected grade, subject, and term: ' + bowId + '.');
    }

    try {
      coveredBowIds = parseCoveredBowIds_(
        storedRows ? day.CoveredBOW_IDs : day.coveredBowIds,
        bowId
      );
    } catch (err) {
      addError('coverage_format', 'Day ' + dayNumber + ' has invalid CoveredBOW_IDs: ' + (err && err.message ? err.message : String(err)));
      coveredBowIds = bowId ? [bowId] : [];
    }

    if (!coveredBowIds.length) {
      addError('coverage_format', 'Day ' + dayNumber + ' has no covered BOW_ID values.');
    } else if (coveredBowIds[0] !== bowId) {
      addError(
        'coverage_format',
        'Day ' + dayNumber + ' BOW_ID must equal the first CoveredBOW_IDs value. Expected ' +
        coveredBowIds[0] + ', received ' + bowId + '.'
      );
    }

    if (storedRows && bowEntry) {
      try {
        validateStoredOfficialBowFields_(day, bowEntry.record, dayNumber);
      } catch (err) {
        addError('official', err && err.message ? err.message : String(err));
      }
    }

    var dayType = String(storedRows ? day.DayType : day.dayType || '').trim();
    var lessonTitle = String(storedRows ? day.LessonTitle : day.lessonTitle || '').trim();
    var shortPurpose = String(storedRows ? day.ShortPurpose : day.shortPurpose || '').trim();
    var difficultyWeight = storedRows ? day.DifficultyWeight : day.difficultyWeight;

    if (!dayType) {
      addError('metadata', 'Term plan has empty dayType for Day ' + dayNumber + '.');
    }
    if (!lessonTitle) {
      addError('metadata', 'Term plan has empty lessonTitle for Day ' + dayNumber + '.');
    }
    if (!shortPurpose) {
      addError('metadata', 'Term plan has empty shortPurpose for Day ' + dayNumber + '.');
    }
    if (difficultyWeight === '' || difficultyWeight === null || typeof difficultyWeight === 'undefined' || isNaN(Number(difficultyWeight))) {
      addError('metadata', 'Term plan has invalid difficultyWeight for Day ' + dayNumber + '.');
    }

    if (storedRows) {
      try {
        validateStoredPlanStatus_(day, dayNumber);
      } catch (err) {
        addError('status', err && err.message ? err.message : String(err));
      }
    }

    var daySeenBowIds = {};
    var previousWithinDayOrder = -1;
    var coveredWeek = '';
    coveredBowIds.forEach(function (coveredBowId) {
      if (daySeenBowIds[coveredBowId]) {
        addError('coverage_format', 'Day ' + dayNumber + ' contains duplicate covered BOW_ID ' + coveredBowId + '.');
        return;
      }
      daySeenBowIds[coveredBowId] = true;

      var coveredEntry = bowMap[coveredBowId];
      if (!coveredEntry) {
        addError(
          'unsupported',
          'Day ' + dayNumber + ' references unsupported covered BOW_ID for the selected term: ' + coveredBowId + '.'
        );
        return;
      }

      var weekValue = normalizeForMatch_(coveredEntry.record.WeekNumber);
      if (!coveredWeek) {
        coveredWeek = weekValue;
      } else if (weekValue !== coveredWeek) {
        addError('coverage_order', 'Day ' + dayNumber + ' combines BOW_IDs from different WeekNumber buckets.');
      }

      var currentOrder = coveredEntry.index;
      if (previousWithinDayOrder >= 0 && currentOrder !== previousWithinDayOrder + 1) {
        addError('coverage_order', 'Day ' + dayNumber + ' CoveredBOW_IDs must be contiguous in official BOW order.');
      }
      if (currentOrder < previousBowOrder) {
        addError(
          'coverage_order',
          'Term plan BOW order is not preserved at Day ' + dayNumber + '. ' +
          'Day ' + previousDayNumber + ' used ' + previousBowId +
          ' (BOW item ' + (previousBowOrder + 1) + '), but Day ' + dayNumber +
          ' returned to ' + coveredBowId + ' (BOW item ' + (currentOrder + 1) + '). ' +
          'Once a later BOW item is used, subsequent days must not return to an earlier BOW_ID.'
        );
      }
      previousWithinDayOrder = currentOrder;
      previousBowOrder = currentOrder;
      previousBowId = coveredBowId;
      previousDayNumber = dayNumber;
      representedBowIds[coveredBowId] = true;
      representedBowDayCounts[coveredBowId] = Number(representedBowDayCounts[coveredBowId] || 0) + 1;
    });

    normalizedRows.push({
      JobID: job.JobID,
      DayNumber: dayNumber,
      BOWWeek: bowEntry ? String(bowEntry.record.WeekNumber || '').trim() : '',
      BOW_ID: bowId,
      CoveredBOW_IDs: serializeCoveredBowIds_(coveredBowIds),
      Domain: bowEntry ? String(bowEntry.record.Domain || '').trim() : '',
      LearningCompetency: bowEntry ? String(bowEntry.record.LearningCompetency || '').trim() : '',
      DayType: dayType,
      LessonTitle: lessonTitle,
      DifficultyWeight: Number(difficultyWeight),
      Status: storedRows ? String(day.Status || '').trim() : DAY_STATUS.PENDING,
      GeneratedAt: storedRows ? (day.GeneratedAt || '') : '',
      LastError: storedRows ? (day.LastError || '') : '',
      ShortPurpose: shortPurpose,
      _rowNumber: storedRows ? day._rowNumber : undefined
    });
  });

  var missingBowIds = [];
  bowRecords.forEach(function (record) {
    var bowId = String(record.BOW_ID || '').trim();
    if (!representedBowIds[bowId]) {
      missingBowIds.push(bowId);
    }
  });

  if (missingBowIds.length) {
    addError(
      'coverage',
      'Term plan omitted ' + missingBowIds.length + ' required BOW_ID(s): ' + missingBowIds.join(', ') + '.'
    );
  }

  if (calendar.mode === 'official_fixed') {
    calendar.resolvedItems.forEach(function (item) {
      var actualCount = Number(representedBowDayCounts[item.bowId] || 0);
      if (actualCount !== item.officialDayCount) {
        addError(
          'official_calendar',
          'Official fixed pacing count mismatch for ' + item.bowId +
          '. Expected ' + item.officialDayCount + ' teaching day(s), found ' + actualCount + '.'
        );
      }
    });
  }

  if (validationErrors.length) {
    var messages = validationErrors.map(function (entry) { return entry.message; });
    var err = createClassifiedError_(messages.join(' '), 'validation');
    err.termPlanDiagnostics = {
      coverageOnly: validationErrors.every(function (entry) { return entry.code === 'coverage'; }),
      missingBowIds: missingBowIds,
      errors: messages
    };
    throw err;
  }

  return normalizedRows;
}

function validateStoredOfficialBowFields_(row, bowRecord, dayNumber) {
  var expected = {
    BOWWeek: String(bowRecord.WeekNumber || '').trim(),
    Domain: String(bowRecord.Domain || '').trim(),
    LearningCompetency: String(bowRecord.LearningCompetency || '').trim()
  };

  Object.keys(expected).forEach(function (fieldName) {
    var actual = String(row[fieldName] || '').trim();
    if (!actual) {
      throw createClassifiedError_('Stored term plan row is partial. Missing ' + fieldName + ' for Day ' + dayNumber + '.', 'validation');
    }
    if (actual !== expected[fieldName]) {
      throw createClassifiedError_('Stored term plan official ' + fieldName + ' does not match BOW_DATABASE for Day ' + dayNumber + '.', 'validation');
    }
  });
}

function validateStoredPlanStatus_(row, dayNumber) {
  var status = String(row.Status || '').trim();
  var allowed = [DAY_STATUS.PENDING, DAY_STATUS.COMPLETED, DAY_STATUS.FAILED];
  if (allowed.indexOf(status) === -1) {
    throw createClassifiedError_('Stored term plan row is partial or has invalid status for Day ' + dayNumber + ': ' + status + '.', 'validation');
  }
}
