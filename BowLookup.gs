function findBowRecord(formRow) {
  var sheet = getSheetByName_(SHEET_NAMES.BOW_DATABASE);
  appendMissingHeaders_(sheet, BOW_HEADERS);

  if (sheet.getLastRow() < 2) {
    throw new Error('BOW_DATABASE has no records. Run Lesson Plan Generator > Setup or Upgrade Project.');
  }

  var values = sheet.getDataRange().getValues();
  var headers = getHeaderMap_(sheet);
  var targetGrade = normalizeForMatch_(formRow.GradeLevel);
  var targetSubject = normalizeForMatch_(formRow.Subject);
  var targetTerm = normalizeForMatch_(formRow.Term);
  var targetWeek = normalizeWeek_(formRow.WeekNumber);

  for (var r = 2; r <= values.length; r++) {
    var row = rowFromValues_(values[r - 1], headers);
    if (
      normalizeForMatch_(row.GradeLevel) === targetGrade &&
      normalizeForMatch_(row.Subject) === targetSubject &&
      normalizeForMatch_(row.Term) === targetTerm &&
      normalizeWeek_(row.WeekNumber) === targetWeek
    ) {
      return row;
    }
  }

  throw new Error(
    'No BOW match found for Grade=' + formRow.GradeLevel +
    ', Subject=' + formRow.Subject +
    ', Term=' + formRow.Term +
    ', Week=' + formRow.WeekNumber + '.'
  );
}

function getBowRecordsForTerm_(gradeLevel, subject, term) {
  var sheet = getSheetByName_(SHEET_NAMES.BOW_DATABASE);
  appendMissingHeaders_(sheet, BOW_HEADERS);

  if (sheet.getLastRow() < 2) {
    return [];
  }

  var targetGrade = normalizeForMatch_(gradeLevel);
  var targetSubject = normalizeForMatch_(subject);
  var targetTerm = normalizeForMatch_(normalizeTerm_(term));
  var records = getSheetObjects_(sheet).filter(function (row) {
    return (
      normalizeForMatch_(row.GradeLevel) === targetGrade &&
      normalizeForMatch_(row.Subject) === targetSubject &&
      normalizeForMatch_(normalizeTerm_(row.Term)) === targetTerm
    );
  });

  return sortBowRecords_(records);
}

function sortBowRecords_(records) {
  var sorted = sortBowRecordsLegacy_((records || []).slice());
  if (!sorted.length) {
    return sorted;
  }

  var calendar = resolveTermCalendar_(
    sorted[0].GradeLevel,
    sorted[0].Subject,
    sorted[0].Term,
    sorted
  );
  return calendar.mode === 'official_fixed'
    ? calendar.orderedBowRecords.slice()
    : sorted;
}

function sortBowRecordsLegacy_(records) {
  return (records || []).sort(function (a, b) {
    var weekA = getWeekNumberValue_(a.WeekNumber);
    var weekB = getWeekNumberValue_(b.WeekNumber);
    if (weekA !== weekB) {
      return weekA - weekB;
    }
    return String(a.BOW_ID || '').localeCompare(String(b.BOW_ID || ''));
  });
}

function getWeekNumberValue_(weekValue) {
  var parsed = parseBowWeekRange_(weekValue);
  return parsed.valid ? parsed.start : 9999;
}

function getBowRecordById_(bowId) {
  var records = getSheetObjects_(SHEET_NAMES.BOW_DATABASE);
  for (var i = 0; i < records.length; i++) {
    if (String(records[i].BOW_ID || '') === String(bowId || '')) {
      return records[i];
    }
  }
  return null;
}

function buildBowMapForTerm_(bowRecords) {
  var map = {};
  (bowRecords || []).forEach(function (record, index) {
    var bowId = String(record.BOW_ID || '').trim();
    if (bowId) {
      map[bowId] = {
        record: record,
        index: index
      };
    }
  });
  return map;
}

function getBowRecordByIdForTerm_(bowId, gradeLevel, subject, term) {
  var records = getBowRecordsForTerm_(gradeLevel, subject, term);
  var map = buildBowMapForTerm_(records);
  var entry = map[String(bowId || '').trim()];
  return entry ? entry.record : null;
}

function hasConstructedPacingBowNotice_(bowRecords) {
  return getConstructedBowDisclosureFlags_(bowRecords).hasConstructedData;
}

function getConstructedBowDisclosureFlags_(bowRecords) {
  var flags = {
    hasConstructedData: false,
    hasConstructedPacing: false,
    hasProposedStandards: false,
    requiresTeacherReview: false
  };

  (bowRecords || []).forEach(function (record) {
    var searchableText = normalizeForMatch_([
      record.Notes,
      record.ContentStandard,
      record.PerformanceStandard,
      record.LearningCompetency
    ].join('\n'));

    var hasWeeklyPacing = searchableText.indexOf('abakada-constructed weekly pacing') !== -1;
    var hasProposedStandardPacing = searchableText.indexOf('abakada-constructed proposed standard/pacing') !== -1;
    var hasProposedPerformanceStandard = searchableText.indexOf('abakada-constructed proposed performance standard') !== -1;
    var requiresTeacherReview = searchableText.indexOf('requires teacher review') !== -1;

    flags.hasConstructedPacing = flags.hasConstructedPacing || hasWeeklyPacing || hasProposedStandardPacing;
    flags.hasProposedStandards = flags.hasProposedStandards || hasProposedStandardPacing || hasProposedPerformanceStandard;
    flags.requiresTeacherReview = flags.requiresTeacherReview || requiresTeacherReview;
    flags.hasConstructedData = flags.hasConstructedData ||
      hasWeeklyPacing ||
      hasProposedStandardPacing ||
      hasProposedPerformanceStandard ||
      requiresTeacherReview;
  });

  return flags;
}

function getConstructedPacingDocNotice_(bowRecords) {
  var flags = getConstructedBowDisclosureFlags_(bowRecords);
  if (flags.hasProposedStandards) {
    return 'Official competencies were used where available. Some weekly pacing, standards, or performance-standard wording in this lesson plan was constructed or proposed by ABAKADA. These constructed items are not official DepEd wording and require teacher review before classroom use.';
  }
  if (flags.hasConstructedPacing) {
    return 'Official competencies used. Weekly pacing is ABAKADA-constructed and requires teacher review. The constructed pacing is not official DepEd weekly-pacing wording.';
  }
  return 'Selected curriculum mapping contains ABAKADA-constructed material identified for review. Constructed items are not official DepEd wording and require teacher review before classroom use.';
}

function getConstructedPacingEmailNoticeLines_(bowRecords) {
  var flags = getConstructedBowDisclosureFlags_(bowRecords);
  var explanation;
  if (flags.hasProposedStandards) {
    explanation = 'This lesson plan was generated using official subject competencies from the available curriculum source files. However, some weekly pacing, standards, or performance-standard wording was constructed or proposed by ABAKADA from the available source material. These constructed items are not official DepEd wording.';
  } else if (flags.hasConstructedPacing) {
    explanation = 'This lesson plan was generated using official subject competencies from the available curriculum source files. However, the weekly pacing for this subject was constructed by ABAKADA because the available source files did not provide fixed week-by-week assignments. The constructed pacing is not official DepEd weekly-pacing wording.';
  } else {
    explanation = 'This lesson plan contains curriculum mapping material identified as ABAKADA-constructed. Constructed items are not official DepEd wording.';
  }

  return [
    'Important Note:',
    explanation,
    '',
    'Please review the generated lesson plan before classroom use and adjust the pacing, standards, activities, or assessments based on your learners’ needs and your school’s instructional plan.',
    ''
  ];
}
