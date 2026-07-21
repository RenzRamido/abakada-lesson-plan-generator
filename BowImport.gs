var BOW_MATH_IMPORT_STAGING_SHEET_ = 'BOW_IMPORT_MATH_REVIEW';
var BOW_MATH_IMPORT_AUDIT_SHEET_ = 'BOW_DATABASE_AUDIT';

var BOW_MATH_IMPORT_HEADERS_ = [
  'BOW_ID',
  'GradeLevel',
  'Subject',
  'Term',
  'WeekNumber',
  'Domain',
  'ContentStandard',
  'PerformanceStandard',
  'LearningCompetency',
  'SourceFile',
  'SourcePage',
  'ExtractionNotes'
];

var BOW_MATH_IMPORT_AUDIT_HEADERS_ = [
  'BOW_ID',
  'SourceFile',
  'SourcePage',
  'ExtractionNotes',
  'ImportBatch',
  'ImportedAt'
];

var BOW_MATH_IMPORT_EXPECTED_SOURCE_ROWS_ = 283;
var BOW_MATH_IMPORT_EXPECTED_PROTECTED_ROWS_ = 27;
var BOW_MATH_IMPORT_EXPECTED_ELIGIBLE_ROWS_ = 256;

var BOW_ENGLISH_IMPORT_STAGING_SHEET_ = 'BOW_IMPORT_ENGLISH_REVIEW';
var BOW_ENGLISH_IMPORT_EXPECTED_SOURCE_ROWS_ = 1372;
var BOW_ENGLISH_IMPORT_CONSTRUCTED_PACING_NOTE_ =
  'ABAKADA-constructed weekly pacing from official English PDF; needs teacher review.';
var BOW_ENGLISH_G2_T2_SUPPLEMENT_STAGING_SHEET_ =
  'BOW_IMPORT_ENGLISH_G2_T2_SUPPLEMENT_REVIEW';
var BOW_ENGLISH_G2_T2_SUPPLEMENT_EXPECTED_SOURCE_ROWS_ = 57;
var BOW_ENGLISH_G2_T2_SUPPLEMENT_PERFORMANCE_PREFIX_ =
  'ABAKADA-constructed proposed Performance Standard (not official DepEd wording):';
var BOW_ENGLISH_G2_T2_SUPPLEMENT_NOTE_ =
  'ABAKADA-constructed weekly pacing and proposed Performance Standard from research; needs teacher review.';
var BOW_ENGLISH_IMPORT_EXPECTED_TERM_COUNTS_ = {
  'First Term': 472,
  'Second Term': 436,
  'Third Term': 464
};

var BOW_ENGLISH_IMPORT_EXPECTED_TUPLES_ = [
  { GradeLevel: 'Grade 1', Term: 'First Term', Count: 74 },
  { GradeLevel: 'Grade 1', Term: 'Second Term', Count: 70 },
  { GradeLevel: 'Grade 1', Term: 'Third Term', Count: 74 },
  { GradeLevel: 'Grade 2', Term: 'First Term', Count: 45 },
  { GradeLevel: 'Grade 2', Term: 'Third Term', Count: 61 },
  { GradeLevel: 'Grade 3', Term: 'First Term', Count: 65 },
  { GradeLevel: 'Grade 3', Term: 'Second Term', Count: 61 },
  { GradeLevel: 'Grade 3', Term: 'Third Term', Count: 59 },
  { GradeLevel: 'Grade 4', Term: 'First Term', Count: 52 },
  { GradeLevel: 'Grade 4', Term: 'Second Term', Count: 63 },
  { GradeLevel: 'Grade 4', Term: 'Third Term', Count: 61 },
  { GradeLevel: 'Grade 5', Term: 'First Term', Count: 66 },
  { GradeLevel: 'Grade 5', Term: 'Second Term', Count: 62 },
  { GradeLevel: 'Grade 5', Term: 'Third Term', Count: 58 },
  { GradeLevel: 'Grade 6', Term: 'First Term', Count: 56 },
  { GradeLevel: 'Grade 6', Term: 'Second Term', Count: 54 },
  { GradeLevel: 'Grade 6', Term: 'Third Term', Count: 54 },
  { GradeLevel: 'Grade 7', Term: 'First Term', Count: 22 },
  { GradeLevel: 'Grade 7', Term: 'Second Term', Count: 33 },
  { GradeLevel: 'Grade 7', Term: 'Third Term', Count: 27 },
  { GradeLevel: 'Grade 8', Term: 'First Term', Count: 27 },
  { GradeLevel: 'Grade 8', Term: 'Second Term', Count: 27 },
  { GradeLevel: 'Grade 8', Term: 'Third Term', Count: 32 },
  { GradeLevel: 'Grade 9', Term: 'First Term', Count: 30 },
  { GradeLevel: 'Grade 9', Term: 'Second Term', Count: 34 },
  { GradeLevel: 'Grade 9', Term: 'Third Term', Count: 17 },
  { GradeLevel: 'Grade 10', Term: 'First Term', Count: 31 },
  { GradeLevel: 'Grade 10', Term: 'Second Term', Count: 28 },
  { GradeLevel: 'Grade 10', Term: 'Third Term', Count: 17 },
  { GradeLevel: 'Grade 11', Term: 'First Term', Count: 4 },
  { GradeLevel: 'Grade 11', Term: 'Second Term', Count: 4 },
  { GradeLevel: 'Grade 11', Term: 'Third Term', Count: 4 }
];

var BOW_SCIENCE_IMPORT_STAGING_SHEET_ = 'BOW_IMPORT_SCIENCE_REVIEW';
var BOW_SCIENCE_IMPORT_EXPECTED_SOURCE_ROWS_ = 134;
var BOW_SCIENCE_IMPORT_EXPECTED_TERM_COUNTS_ = {
  'First Term': 48,
  'Second Term': 46,
  'Third Term': 40
};
var BOW_SCIENCE_IMPORT_EXPECTED_GRADE_COUNTS_ = {
  'Grade 3': 13,
  'Grade 4': 14,
  'Grade 5': 14,
  'Grade 6': 17,
  'Grade 7': 14,
  'Grade 8': 17,
  'Grade 9': 12,
  'Grade 10': 14,
  'Grade 11': 19
};
var BOW_SCIENCE_IMPORT_EXPECTED_TUPLES_ = [
  { GradeLevel: 'Grade 3', Term: 'First Term', Count: 4 },
  { GradeLevel: 'Grade 3', Term: 'Second Term', Count: 5 },
  { GradeLevel: 'Grade 3', Term: 'Third Term', Count: 4 },
  { GradeLevel: 'Grade 4', Term: 'First Term', Count: 5 },
  { GradeLevel: 'Grade 4', Term: 'Second Term', Count: 5 },
  { GradeLevel: 'Grade 4', Term: 'Third Term', Count: 4 },
  { GradeLevel: 'Grade 5', Term: 'First Term', Count: 4 },
  { GradeLevel: 'Grade 5', Term: 'Second Term', Count: 5 },
  { GradeLevel: 'Grade 5', Term: 'Third Term', Count: 5 },
  { GradeLevel: 'Grade 6', Term: 'First Term', Count: 7 },
  { GradeLevel: 'Grade 6', Term: 'Second Term', Count: 5 },
  { GradeLevel: 'Grade 6', Term: 'Third Term', Count: 5 },
  { GradeLevel: 'Grade 7', Term: 'First Term', Count: 5 },
  { GradeLevel: 'Grade 7', Term: 'Second Term', Count: 6 },
  { GradeLevel: 'Grade 7', Term: 'Third Term', Count: 3 },
  { GradeLevel: 'Grade 8', Term: 'First Term', Count: 6 },
  { GradeLevel: 'Grade 8', Term: 'Second Term', Count: 4 },
  { GradeLevel: 'Grade 8', Term: 'Third Term', Count: 7 },
  { GradeLevel: 'Grade 9', Term: 'First Term', Count: 3 },
  { GradeLevel: 'Grade 9', Term: 'Second Term', Count: 5 },
  { GradeLevel: 'Grade 9', Term: 'Third Term', Count: 4 },
  { GradeLevel: 'Grade 10', Term: 'First Term', Count: 6 },
  { GradeLevel: 'Grade 10', Term: 'Second Term', Count: 5 },
  { GradeLevel: 'Grade 10', Term: 'Third Term', Count: 3 },
  { GradeLevel: 'Grade 11', Term: 'First Term', Count: 8 },
  { GradeLevel: 'Grade 11', Term: 'Second Term', Count: 6 },
  { GradeLevel: 'Grade 11', Term: 'Third Term', Count: 5 }
];

var BOW_FILIPINO_IMPORT_STAGING_SHEET_ = 'BOW_IMPORT_FILIPINO_REVIEW';
var BOW_FILIPINO_IMPORT_EXPECTED_SOURCE_ROWS_ = 372;
var BOW_FILIPINO_IMPORT_CONSTRUCTED_PACING_NOTE_ =
  'ABAKADA-constructed weekly pacing from official Filipino PDF; needs teacher review.';

var BOW_AP_IMPORT_STAGING_SHEET_ = 'BOW_IMPORT_ARALING_PANLIPUNAN_REVIEW';
var BOW_AP_IMPORT_EXPECTED_SOURCE_ROWS_ = 226;
var BOW_AP_IMPORT_EXPECTED_RANGE_WEEK_ROWS_ = 102;
var BOW_AP_IMPORT_EXPECTED_SINGLE_WEEK_ROWS_ = 124;

var BOW_AP_SUBJECT_MAKABANSA_ = { name: 'Makabansa', code: 'MAKA' };
var BOW_AP_SUBJECT_ARALING_PANLIPUNAN_ = { name: 'Araling Panlipunan', code: 'AP' };
var BOW_AP_SUBJECT_PKLP_ = {
  name: 'Pag-aaral ng Kasaysayan at Lipunang Pilipino',
  code: 'PKLP'
};

// Single source of truth for both the Subject check and the BOW_ID code.
// Makabansa G1-3, Araling Panlipunan G4-10, PKLP G11.
var BOW_AP_SUBJECT_BY_GRADE_ = {
  1: BOW_AP_SUBJECT_MAKABANSA_,
  2: BOW_AP_SUBJECT_MAKABANSA_,
  3: BOW_AP_SUBJECT_MAKABANSA_,
  4: BOW_AP_SUBJECT_ARALING_PANLIPUNAN_,
  5: BOW_AP_SUBJECT_ARALING_PANLIPUNAN_,
  6: BOW_AP_SUBJECT_ARALING_PANLIPUNAN_,
  7: BOW_AP_SUBJECT_ARALING_PANLIPUNAN_,
  8: BOW_AP_SUBJECT_ARALING_PANLIPUNAN_,
  9: BOW_AP_SUBJECT_ARALING_PANLIPUNAN_,
  10: BOW_AP_SUBJECT_ARALING_PANLIPUNAN_,
  11: BOW_AP_SUBJECT_PKLP_
};

var BOW_AP_IMPORT_EXPECTED_TUPLES_ = [
  { GradeLevel: 'Grade 1', Term: 'First Term', Count: 3 },
  { GradeLevel: 'Grade 1', Term: 'Second Term', Count: 3 },
  { GradeLevel: 'Grade 1', Term: 'Third Term', Count: 7 },
  { GradeLevel: 'Grade 2', Term: 'First Term', Count: 4 },
  { GradeLevel: 'Grade 2', Term: 'Second Term', Count: 4 },
  { GradeLevel: 'Grade 2', Term: 'Third Term', Count: 6 },
  { GradeLevel: 'Grade 3', Term: 'First Term', Count: 3 },
  { GradeLevel: 'Grade 3', Term: 'Second Term', Count: 4 },
  { GradeLevel: 'Grade 3', Term: 'Third Term', Count: 6 },
  { GradeLevel: 'Grade 4', Term: 'First Term', Count: 10 },
  { GradeLevel: 'Grade 4', Term: 'Second Term', Count: 5 },
  { GradeLevel: 'Grade 4', Term: 'Third Term', Count: 5 },
  { GradeLevel: 'Grade 5', Term: 'First Term', Count: 13 },
  { GradeLevel: 'Grade 5', Term: 'Second Term', Count: 6 },
  { GradeLevel: 'Grade 5', Term: 'Third Term', Count: 7 },
  { GradeLevel: 'Grade 6', Term: 'First Term', Count: 8 },
  { GradeLevel: 'Grade 6', Term: 'Second Term', Count: 10 },
  { GradeLevel: 'Grade 6', Term: 'Third Term', Count: 5 },
  { GradeLevel: 'Grade 7', Term: 'First Term', Count: 8 },
  { GradeLevel: 'Grade 7', Term: 'Second Term', Count: 8 },
  { GradeLevel: 'Grade 7', Term: 'Third Term', Count: 7 },
  { GradeLevel: 'Grade 8', Term: 'First Term', Count: 9 },
  { GradeLevel: 'Grade 8', Term: 'Second Term', Count: 8 },
  { GradeLevel: 'Grade 8', Term: 'Third Term', Count: 8 },
  { GradeLevel: 'Grade 9', Term: 'First Term', Count: 12 },
  { GradeLevel: 'Grade 9', Term: 'Second Term', Count: 8 },
  { GradeLevel: 'Grade 9', Term: 'Third Term', Count: 10 },
  { GradeLevel: 'Grade 10', Term: 'First Term', Count: 7 },
  { GradeLevel: 'Grade 10', Term: 'Second Term', Count: 8 },
  { GradeLevel: 'Grade 10', Term: 'Third Term', Count: 5 },
  { GradeLevel: 'Grade 11', Term: 'First Term', Count: 5 },
  { GradeLevel: 'Grade 11', Term: 'Second Term', Count: 6 },
  { GradeLevel: 'Grade 11', Term: 'Third Term', Count: 8 }
];

var BOW_AP_IMPORT_EXPECTED_SUBJECT_COUNTS_ = {
  'Makabansa': 40,
  'Araling Panlipunan': 167,
  'Pag-aaral ng Kasaysayan at Lipunang Pilipino': 19
};

var BOW_GMRC_VALUES_IMPORT_STAGING_SHEET_ = 'BOW_IMPORT_GMRC_VALUES_REVIEW';
var BOW_GMRC_VALUES_IMPORT_EXPECTED_SOURCE_ROWS_ = 259;
var BOW_GMRC_VALUES_IMPORT_EXPECTED_TUPLES_ = 30;
var BOW_GMRC_VALUES_IMPORT_EXPECTED_SUBJECT_COUNTS_ = {
  GMRC: 152,
  'Values Education': 107
};

var BOW_GMRC_VALUES_SUBJECT_GMRC_ = { name: 'GMRC', code: 'GMRC' };
var BOW_GMRC_VALUES_SUBJECT_VALUES_EDUCATION_ = {
  name: 'Values Education',
  code: 'VE'
};

var BOW_GMRC_VALUES_SUBJECT_BY_GRADE_ = {
  1: BOW_GMRC_VALUES_SUBJECT_GMRC_,
  2: BOW_GMRC_VALUES_SUBJECT_GMRC_,
  3: BOW_GMRC_VALUES_SUBJECT_GMRC_,
  4: BOW_GMRC_VALUES_SUBJECT_GMRC_,
  5: BOW_GMRC_VALUES_SUBJECT_GMRC_,
  6: BOW_GMRC_VALUES_SUBJECT_GMRC_,
  7: BOW_GMRC_VALUES_SUBJECT_VALUES_EDUCATION_,
  8: BOW_GMRC_VALUES_SUBJECT_VALUES_EDUCATION_,
  9: BOW_GMRC_VALUES_SUBJECT_VALUES_EDUCATION_,
  10: BOW_GMRC_VALUES_SUBJECT_VALUES_EDUCATION_
};

var BOW_MAPEH_IMPORT_STAGING_SHEET_ = 'BOW_IMPORT_MAPEH_REVIEW';
var BOW_MAPEH_IMPORT_EXPECTED_SOURCE_ROWS_ = 183;
var BOW_MAPEH_IMPORT_EXPECTED_TUPLES_ = 21;
var BOW_MAPEH_IMPORT_REVIEW_LABEL_ =
  'ABAKADA-constructed proposed standard/pacing based on official MAPEH competencies; requires teacher review.';
var BOW_MAPEH_IMPORT_EXPECTED_TERM_COUNTS_ = {
  'First Term': 64,
  'Second Term': 59,
  'Third Term': 60
};
var BOW_MAPEH_IMPORT_EXPECTED_DOMAIN_COUNTS_ = {
  'Music and Arts': 91,
  'Physical Education and Health': 92
};

function prepareMathBowImportStaging() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(BOW_MATH_IMPORT_STAGING_SHEET_);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(BOW_MATH_IMPORT_STAGING_SHEET_);
    sheet.getRange(1, 1, 1, BOW_MATH_IMPORT_HEADERS_.length).setValues([BOW_MATH_IMPORT_HEADERS_]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() > 1) {
    throw new Error(
      BOW_MATH_IMPORT_STAGING_SHEET_ +
      ' already contains data. It was not cleared or overwritten.'
    );
  } else {
    assertExactSheetHeaders_(sheet, BOW_MATH_IMPORT_HEADERS_, BOW_MATH_IMPORT_STAGING_SHEET_);
  }

  SpreadsheetApp.getUi().alert(
    BOW_MATH_IMPORT_STAGING_SHEET_ +
    ' is ready. Import the reviewed CSV into this sheet without changing its headers, then run dryRunMathBowImport.'
  );
}

function dryRunMathBowImport() {
  var report = buildMathBowImportDryRun_();
  Logger.log(report.text);
  SpreadsheetApp.getUi().alert(report.text);
  return report;
}

function commitMathBowImport() {
  var initialReport = buildMathBowImportDryRun_();
  if (!initialReport.valid) {
    throw new Error('Mathematics BOW import dry run failed:\n' + initialReport.errors.join('\n'));
  }

  var ui = SpreadsheetApp.getUi();
  var confirmation = ui.alert(
    'Commit Mathematics BOW import?',
    initialReport.text +
    '\n\nThis will append ' + initialReport.eligibleRows.length +
    ' inactive rows, create audit entries, and leave all protected Grade 2 Mathematics rows unchanged.',
    ui.ButtonSet.YES_NO
  );
  if (confirmation !== ui.Button.YES) {
    return { committed: false, reason: 'Cancelled by user.' };
  }

  var result = withScriptLock_(function () {
    var report = buildMathBowImportDryRun_();
    if (!report.valid) {
      throw new Error('Mathematics BOW import dry run failed after acquiring the script lock:\n' + report.errors.join('\n'));
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var bowSheet = requireExistingSheet_(spreadsheet, SHEET_NAMES.BOW_DATABASE);
    var auditSheet = spreadsheet.getSheetByName(BOW_MATH_IMPORT_AUDIT_SHEET_);
    var auditExisted = !!auditSheet;
    var timestamp = Utilities.formatDate(now_(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
    var importBatch = 'MATH_REVIEW_' + timestamp;
    var bowBackup = createImportBackupSheet_(spreadsheet, bowSheet, 'BOW_DATABASE_BACKUP_' + timestamp);
    var auditBackup = auditSheet
      ? createImportBackupSheet_(spreadsheet, auditSheet, 'BOW_AUDIT_BACKUP_' + timestamp)
      : null;
    var bowRowCountBefore = Math.max(bowSheet.getLastRow() - 1, 0);
    var supportChecksumBefore = checksumSheetData_(requireExistingSheet_(spreadsheet, SHEET_NAMES.SUPPORT_MATRIX));
    var grade2SnapshotBefore = getGrade2MathSnapshot_(bowSheet);

    try {
      appendMathBowImportRows_(bowSheet, report.eligibleRows);
      auditSheet = ensureMathBowAuditSheet_(spreadsheet);
      appendMathBowAuditRows_(auditSheet, report.eligibleRows, importBatch);
      SpreadsheetApp.flush();

      var validation = validateCommittedMathBowImport_({
        spreadsheet: spreadsheet,
        bowSheet: bowSheet,
        auditSheet: auditSheet,
        eligibleRows: report.eligibleRows,
        importBatch: importBatch,
        bowRowCountBefore: bowRowCountBefore,
        supportChecksumBefore: supportChecksumBefore,
        grade2SnapshotBefore: grade2SnapshotBefore
      });

      if (!validation.valid) {
        throw new Error('Post-import validation failed:\n' + validation.errors.join('\n'));
      }

      var preflight = runPreflightChecks_();
      if (preflight.failures) {
        throw new Error('Existing preflight failed after import:\n' + preflight.lines.join('\n'));
      }

      var finalSupportChecksum = checksumSheetData_(requireExistingSheet_(spreadsheet, SHEET_NAMES.SUPPORT_MATRIX));
      if (finalSupportChecksum !== supportChecksumBefore) {
        throw new Error('SUPPORT_MATRIX changed during import or preflight.');
      }

      var result = {
        committed: true,
        importBatch: importBatch,
        sourceRows: report.sourceRows,
        protectedRows: report.protectedRows.length,
        importedRows: report.eligibleRows.length,
        bowBackupSheet: bowBackup.getName(),
        auditBackupSheet: auditBackup ? auditBackup.getName() : '',
        preflightSummary: preflight.summary
      };
      Logger.log(JSON.stringify(result));
      return result;
    } catch (err) {
      restoreSheetFromImportBackup_(bowSheet, bowBackup);
      if (auditExisted) {
        restoreSheetFromImportBackup_(auditSheet, auditBackup);
      } else if (auditSheet && spreadsheet.getSheets().length > 1) {
        spreadsheet.deleteSheet(auditSheet);
      }
      SpreadsheetApp.flush();
      throw new Error(
        'Mathematics BOW import was rolled back. Backup sheets were retained. ' +
        (err && err.message ? err.message : String(err))
      );
    }
  }, 30000);

  ui.alert(
    'Mathematics BOW import completed.\n\n' +
    'Batch: ' + result.importBatch + '\n' +
    'Imported rows: ' + result.importedRows + '\n' +
    'Protected Grade 2 rows excluded: ' + result.protectedRows + '\n' +
    'BOW backup: ' + result.bowBackupSheet + '\n' +
    'Audit backup: ' + (result.auditBackupSheet || '(audit sheet did not previously exist)') + '\n' +
    'Preflight: ' + result.preflightSummary
  );
  return result;
}

function buildMathBowImportDryRun_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var errors = [];
  var stagingSheet = spreadsheet.getSheetByName(BOW_MATH_IMPORT_STAGING_SHEET_);

  if (!stagingSheet) {
    return createMathBowImportReport_(
      errors.concat([
        'Missing staging sheet: ' + BOW_MATH_IMPORT_STAGING_SHEET_ +
        '. Run prepareMathBowImportStaging and import the reviewed CSV first.'
      ]),
      [],
      [],
      0
    );
  }

  try {
    assertExactSheetHeaders_(stagingSheet, BOW_MATH_IMPORT_HEADERS_, BOW_MATH_IMPORT_STAGING_SHEET_);
  } catch (err) {
    errors.push(err.message);
  }

  var sourceRows = readMathBowStagingRows_(stagingSheet);
  if (sourceRows.length !== BOW_MATH_IMPORT_EXPECTED_SOURCE_ROWS_) {
    errors.push(
      'Expected exactly ' + BOW_MATH_IMPORT_EXPECTED_SOURCE_ROWS_ +
      ' source rows, found ' + sourceRows.length + '.'
    );
  }

  validateMathBowSourceRows_(sourceRows, errors);

  var protectedTupleSet = getProcessableSupportTupleSet_();
  var protectedRows = [];
  var eligibleRows = [];

  sourceRows.forEach(function (row) {
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    if (protectedTupleSet[key]) {
      protectedRows.push(row);
    } else {
      eligibleRows.push(row);
    }
  });

  if (protectedRows.length !== BOW_MATH_IMPORT_EXPECTED_PROTECTED_ROWS_) {
    errors.push(
      'Expected exactly ' + BOW_MATH_IMPORT_EXPECTED_PROTECTED_ROWS_ +
      ' protected rows, found ' + protectedRows.length + '.'
    );
  }
  if (eligibleRows.length !== BOW_MATH_IMPORT_EXPECTED_ELIGIBLE_ROWS_) {
    errors.push(
      'Expected exactly ' + BOW_MATH_IMPORT_EXPECTED_ELIGIBLE_ROWS_ +
      ' eligible inactive rows, found ' + eligibleRows.length + '.'
    );
  }

  protectedRows.forEach(function (row) {
    if (
      normalizeForMatch_(row.GradeLevel) !== 'grade 2' ||
      normalizeForMatch_(row.Subject) !== 'mathematics'
    ) {
      errors.push('Unexpected protected row outside Grade 2 Mathematics: ' + row.BOW_ID + '.');
    }
  });

  sourceRows.filter(function (row) {
    return normalizeForMatch_(row.GradeLevel) === 'grade 2' &&
      normalizeForMatch_(row.Subject) === 'mathematics';
  }).forEach(function (row) {
    if (!protectedTupleSet[supportMatrixKey_(row.GradeLevel, row.Subject, row.Term)]) {
      errors.push('Grade 2 Mathematics source row is not protected: ' + row.BOW_ID + '.');
    }
  });

  validateEligibleRowsAgainstLiveData_(spreadsheet, eligibleRows, errors);
  return createMathBowImportReport_(errors, protectedRows, eligibleRows, sourceRows.length);
}

function validateMathBowSourceRows_(rows, errors) {
  var requiredFields = BOW_HEADERS.filter(function (header) {
    return header !== 'Notes';
  });
  var seenIds = {};

  rows.forEach(function (row, index) {
    var rowLabel = 'Staging row ' + (index + 2);
    requiredFields.forEach(function (fieldName) {
      if (!String(row[fieldName] || '').trim()) {
        errors.push(rowLabel + ' is missing ' + fieldName + '.');
      }
    });

    var bowId = String(row.BOW_ID || '').trim();
    if (bowId) {
      if (seenIds[bowId]) {
        errors.push('Duplicate source BOW_ID: ' + bowId + '.');
      }
      seenIds[bowId] = true;
    }

    validateMathBowIdentity_(row, rowLabel, errors);
  });
}

function validateMathBowIdentity_(row, rowLabel, errors) {
  var gradeMatch = String(row.GradeLevel || '').trim().match(/^Grade (10|11|[1-9])$/);
  if (!gradeMatch) {
    errors.push(rowLabel + ' has invalid GradeLevel: ' + row.GradeLevel + '.');
    return;
  }

  var gradeNumber = Number(gradeMatch[1]);
  var expectedSubject = gradeNumber === 11 ? 'General Mathematics' : 'Mathematics';
  if (String(row.Subject || '').trim() !== expectedSubject) {
    errors.push(rowLabel + ' must use Subject "' + expectedSubject + '".');
  }

  var termNumbers = {
    'First Term': 1,
    'Second Term': 2,
    'Third Term': 3
  };
  var term = String(row.Term || '').trim();
  var termNumber = termNumbers[term];
  if (!termNumber) {
    errors.push(rowLabel + ' has invalid Term: ' + row.Term + '.');
    return;
  }

  var idSubject = gradeNumber === 11 ? 'GENMATH' : 'MATH';
  var expectedPattern = new RegExp(
    '^BOW-G' + gradeNumber + '-' + idSubject + '-T' + termNumber + '-W\\d+(?:-\\d+)?$'
  );
  if (!expectedPattern.test(String(row.BOW_ID || '').trim())) {
    errors.push(rowLabel + ' has an invalid BOW_ID convention: ' + row.BOW_ID + '.');
  }
}

function getProcessableSupportTupleSet_() {
  var protectedTuples = {};
  getSheetObjects_(SHEET_NAMES.SUPPORT_MATRIX).forEach(function (row) {
    var status = getSupportStatus_(row);
    if (status.supported) {
      protectedTuples[supportMatrixKey_(row.GradeLevel, row.Subject, row.Term)] = true;
    }
  });
  return protectedTuples;
}

function validateEligibleRowsAgainstLiveData_(spreadsheet, eligibleRows, errors) {
  var bowSheet = spreadsheet.getSheetByName(SHEET_NAMES.BOW_DATABASE);
  if (!bowSheet) {
    errors.push('Missing live sheet: ' + SHEET_NAMES.BOW_DATABASE + '.');
    return;
  }

  try {
    assertRequiredHeaders_(bowSheet, BOW_HEADERS, SHEET_NAMES.BOW_DATABASE);
  } catch (err) {
    errors.push(err.message);
    return;
  }

  var existingIds = {};
  getSheetObjects_(bowSheet).forEach(function (row) {
    var bowId = String(row.BOW_ID || '').trim();
    if (!bowId) {
      return;
    }
    if (existingIds[bowId]) {
      errors.push('Live BOW_DATABASE already contains duplicate BOW_ID: ' + bowId + '.');
    }
    existingIds[bowId] = true;
  });

  eligibleRows.forEach(function (row) {
    var bowId = String(row.BOW_ID || '').trim();
    if (existingIds[bowId]) {
      errors.push('Eligible BOW_ID already exists in BOW_DATABASE: ' + bowId + '.');
    }
  });

  var auditSheet = spreadsheet.getSheetByName(BOW_MATH_IMPORT_AUDIT_SHEET_);
  if (auditSheet) {
    try {
      assertExactSheetHeaders_(auditSheet, BOW_MATH_IMPORT_AUDIT_HEADERS_, BOW_MATH_IMPORT_AUDIT_SHEET_);
      var auditedIds = {};
      getSheetObjects_(auditSheet).forEach(function (row) {
        var bowId = String(row.BOW_ID || '').trim();
        if (bowId) {
          auditedIds[bowId] = true;
        }
      });
      eligibleRows.forEach(function (row) {
        if (auditedIds[String(row.BOW_ID || '').trim()]) {
          errors.push('Eligible BOW_ID already exists in BOW_DATABASE_AUDIT: ' + row.BOW_ID + '.');
        }
      });
    } catch (err) {
      errors.push(err.message);
    }
  }
}

function appendMathBowImportRows_(bowSheet, eligibleRows) {
  var headerMap = getHeaderMap_(bowSheet);
  var lastColumn = bowSheet.getLastColumn();
  var values = eligibleRows.map(function (sourceRow) {
    var row = new Array(lastColumn).fill('');
    BOW_HEADERS.forEach(function (header) {
      row[headerMap[header] - 1] = header === 'Notes' ? '' : sourceRow[header];
    });
    return row;
  });

  if (values.length) {
    bowSheet.getRange(bowSheet.getLastRow() + 1, 1, values.length, lastColumn).setValues(values);
  }
}

function ensureMathBowAuditSheet_(spreadsheet) {
  var sheet = spreadsheet.getSheetByName(BOW_MATH_IMPORT_AUDIT_SHEET_);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(BOW_MATH_IMPORT_AUDIT_SHEET_);
    sheet.getRange(1, 1, 1, BOW_MATH_IMPORT_AUDIT_HEADERS_.length)
      .setValues([BOW_MATH_IMPORT_AUDIT_HEADERS_]);
    sheet.setFrozenRows(1);
  } else {
    assertExactSheetHeaders_(sheet, BOW_MATH_IMPORT_AUDIT_HEADERS_, BOW_MATH_IMPORT_AUDIT_SHEET_);
  }
  return sheet;
}

function appendMathBowAuditRows_(auditSheet, eligibleRows, importBatch) {
  var importedAt = now_();
  var values = eligibleRows.map(function (row) {
    return [
      row.BOW_ID,
      row.SourceFile,
      row.SourcePage,
      row.ExtractionNotes,
      importBatch,
      importedAt
    ];
  });

  if (values.length) {
    auditSheet.getRange(auditSheet.getLastRow() + 1, 1, values.length, values[0].length)
      .setValues(values);
  }
}

function validateCommittedMathBowImport_(context) {
  var errors = [];
  var expectedCount = context.eligibleRows.length;
  var bowRowCountAfter = Math.max(context.bowSheet.getLastRow() - 1, 0);
  if (bowRowCountAfter - context.bowRowCountBefore !== expectedCount) {
    errors.push(
      'BOW_DATABASE row count changed by ' +
      (bowRowCountAfter - context.bowRowCountBefore) +
      ', expected ' + expectedCount + '.'
    );
  }

  var liveRows = getSheetObjects_(context.bowSheet);
  var liveById = {};
  liveRows.forEach(function (row) {
    var bowId = String(row.BOW_ID || '').trim();
    if (!bowId) {
      return;
    }
    if (liveById[bowId]) {
      errors.push('Duplicate BOW_ID after import: ' + bowId + '.');
    }
    liveById[bowId] = row;
  });

  context.eligibleRows.forEach(function (sourceRow) {
    var liveRow = liveById[String(sourceRow.BOW_ID || '').trim()];
    if (!liveRow) {
      errors.push('Imported row is missing from BOW_DATABASE: ' + sourceRow.BOW_ID + '.');
      return;
    }
    BOW_HEADERS.forEach(function (header) {
      var expected = header === 'Notes' ? '' : sourceRow[header];
      if (normalizeImportCell_(liveRow[header]) !== normalizeImportCell_(expected)) {
        errors.push(sourceRow.BOW_ID + ' does not match staging field ' + header + '.');
      }
    });
  });

  var auditMatches = {};
  getSheetObjects_(context.auditSheet).forEach(function (row) {
    if (String(row.ImportBatch || '') === context.importBatch) {
      var bowId = String(row.BOW_ID || '').trim();
      if (auditMatches[bowId]) {
        errors.push('Duplicate audit row for import batch and BOW_ID: ' + bowId + '.');
      }
      auditMatches[bowId] = row;
    }
  });

  context.eligibleRows.forEach(function (sourceRow) {
    var auditRow = auditMatches[String(sourceRow.BOW_ID || '').trim()];
    if (!auditRow) {
      errors.push('Missing audit row for imported BOW_ID: ' + sourceRow.BOW_ID + '.');
      return;
    }
    ['SourceFile', 'SourcePage', 'ExtractionNotes'].forEach(function (header) {
      if (normalizeImportCell_(auditRow[header]) !== normalizeImportCell_(sourceRow[header])) {
        errors.push(sourceRow.BOW_ID + ' audit field does not match staging: ' + header + '.');
      }
    });
  });

  if (Object.keys(auditMatches).length !== expectedCount) {
    errors.push(
      'Audit batch contains ' + Object.keys(auditMatches).length +
      ' rows, expected ' + expectedCount + '.'
    );
  }

  var grade2SnapshotAfter = getGrade2MathSnapshot_(context.bowSheet);
  if (
    grade2SnapshotAfter.count !== context.grade2SnapshotBefore.count ||
    grade2SnapshotAfter.checksum !== context.grade2SnapshotBefore.checksum
  ) {
    errors.push('Existing Grade 2 Mathematics rows changed during import.');
  }

  if (
    checksumSheetData_(requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUPPORT_MATRIX)) !==
    context.supportChecksumBefore
  ) {
    errors.push('SUPPORT_MATRIX changed during import.');
  }

  var checkedTuples = {};
  context.eligibleRows.forEach(function (row) {
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    if (checkedTuples[key]) {
      return;
    }
    checkedTuples[key] = true;
    if (getSupportStatus_(row).supported) {
      errors.push(
        'Imported combination became processable: ' +
        row.GradeLevel + ' / ' + row.Subject + ' / ' + row.Term + '.'
      );
    }
  });

  return { valid: errors.length === 0, errors: errors };
}

function getGrade2MathSnapshot_(bowSheet) {
  var values = bowSheet.getDataRange().getValues();
  var headers = getHeaderMap_(bowSheet);
  var gradeColumn = headers.GradeLevel;
  var subjectColumn = headers.Subject;
  var rows = values.slice(1).filter(function (row) {
    return normalizeForMatch_(row[gradeColumn - 1]) === 'grade 2' &&
      normalizeForMatch_(row[subjectColumn - 1]) === 'mathematics';
  });
  return {
    count: rows.length,
    checksum: checksumValues_(rows)
  };
}

function createImportBackupSheet_(spreadsheet, sourceSheet, requestedName) {
  var backupName = uniqueSheetName_(spreadsheet, requestedName);
  return sourceSheet.copyTo(spreadsheet).setName(backupName);
}

function restoreSheetFromImportBackup_(targetSheet, backupSheet) {
  if (!targetSheet || !backupSheet) {
    return;
  }
  targetSheet.clear();
  var sourceRange = backupSheet.getDataRange();
  sourceRange.copyTo(targetSheet.getRange(1, 1, sourceRange.getNumRows(), sourceRange.getNumColumns()));
  targetSheet.setFrozenRows(backupSheet.getFrozenRows());
  targetSheet.setFrozenColumns(backupSheet.getFrozenColumns());
}

function uniqueSheetName_(spreadsheet, requestedName) {
  var base = String(requestedName || 'BOW_IMPORT_BACKUP').substring(0, 95);
  var candidate = base;
  var suffix = 2;
  while (spreadsheet.getSheetByName(candidate)) {
    candidate = (base.substring(0, 95 - String(suffix).length) + '_' + suffix);
    suffix += 1;
  }
  return candidate;
}

function readMathBowStagingRows_(sheet) {
  if (sheet.getLastRow() < 2) {
    return [];
  }
  var values = sheet.getRange(
    2,
    1,
    sheet.getLastRow() - 1,
    BOW_MATH_IMPORT_HEADERS_.length
  ).getValues();
  return values.map(function (row) {
    var object = {};
    BOW_MATH_IMPORT_HEADERS_.forEach(function (header, index) {
      object[header] = row[index];
    });
    return object;
  });
}

function assertExactSheetHeaders_(sheet, expectedHeaders, label) {
  var lastColumn = sheet.getLastColumn();
  var actualHeaders = sheet.getRange(1, 1, 1, Math.max(lastColumn, 1)).getValues()[0]
    .map(function (header) {
      return String(header || '').trim();
    });
  if (
    lastColumn !== expectedHeaders.length ||
    actualHeaders.join('\u001f') !== expectedHeaders.join('\u001f')
  ) {
    throw new Error(
      label + ' must contain exactly these headers in order: ' + expectedHeaders.join(', ') + '.'
    );
  }
}

function assertRequiredHeaders_(sheet, requiredHeaders, label) {
  var headerMap = getHeaderMap_(sheet);
  var missing = requiredHeaders.filter(function (header) {
    return !headerMap[header];
  });
  if (missing.length) {
    throw new Error(label + ' is missing required header(s): ' + missing.join(', ') + '.');
  }
}

function requireExistingSheet_(spreadsheet, sheetName) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Missing required sheet: ' + sheetName + '.');
  }
  return sheet;
}

function checksumSheetData_(sheet) {
  return checksumValues_(sheet.getDataRange().getValues());
}

function checksumValues_(values) {
  var normalized = (values || []).map(function (row) {
    return row.map(normalizeImportCell_);
  });
  var digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    JSON.stringify(normalized),
    Utilities.Charset.UTF_8
  );
  return digest.map(function (value) {
    var unsigned = value < 0 ? value + 256 : value;
    return ('0' + unsigned.toString(16)).slice(-2);
  }).join('');
}

function normalizeImportCell_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return 'date:' + value.toISOString();
  }
  if (value === null || typeof value === 'undefined') {
    return '';
  }
  return typeof value + ':' + String(value);
}

function createMathBowImportReport_(errors, protectedRows, eligibleRows, sourceRowCount) {
  var valid = errors.length === 0;
  var lines = [
    valid ? 'Mathematics BOW import dry run passed.' : 'Mathematics BOW import dry run failed.',
    'Source rows: ' + sourceRowCount + ' / ' + BOW_MATH_IMPORT_EXPECTED_SOURCE_ROWS_,
    'Protected Grade 2 rows: ' + protectedRows.length + ' / ' + BOW_MATH_IMPORT_EXPECTED_PROTECTED_ROWS_,
    'Eligible inactive rows: ' + eligibleRows.length + ' / ' + BOW_MATH_IMPORT_EXPECTED_ELIGIBLE_ROWS_,
    'Eligible BOW_ID conflicts: ' + countImportErrors_(errors, 'Eligible BOW_ID already exists'),
    'Validation errors: ' + errors.length
  ];
  if (errors.length) {
    lines.push('', errors.slice(0, 20).join('\n'));
    if (errors.length > 20) {
      lines.push('Additional errors omitted: ' + (errors.length - 20) + '.');
    }
  }
  return {
    valid: valid,
    errors: errors,
    sourceRows: sourceRowCount,
    protectedRows: protectedRows,
    eligibleRows: eligibleRows,
    text: lines.join('\n')
  };
}

function countImportErrors_(errors, prefix) {
  return errors.filter(function (message) {
    return String(message || '').indexOf(prefix) === 0;
  }).length;
}

function prepareEnglishBowImportStaging() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(BOW_ENGLISH_IMPORT_STAGING_SHEET_);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(BOW_ENGLISH_IMPORT_STAGING_SHEET_);
    sheet.getRange(1, 1, 1, BOW_MATH_IMPORT_HEADERS_.length)
      .setValues([BOW_MATH_IMPORT_HEADERS_]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() > 1) {
    throw new Error(
      BOW_ENGLISH_IMPORT_STAGING_SHEET_ +
      ' already contains data. It was not cleared or overwritten.'
    );
  } else {
    assertExactSheetHeaders_(
      sheet,
      BOW_MATH_IMPORT_HEADERS_,
      BOW_ENGLISH_IMPORT_STAGING_SHEET_
    );
  }

  SpreadsheetApp.getUi().alert(
    BOW_ENGLISH_IMPORT_STAGING_SHEET_ +
    ' is ready. Import the reviewed English CSV without changing its headers, then run dryRunEnglishBowImport.'
  );
}

function dryRunEnglishBowImport() {
  var report = buildEnglishBowImportDryRun_();
  Logger.log(report.text);
  SpreadsheetApp.getUi().alert(report.text);
  return report;
}

function commitEnglishBowImport() {
  var initialReport = buildEnglishBowImportDryRun_();
  if (!initialReport.valid) {
    throw new Error('English BOW import dry run failed:\n' + initialReport.errors.join('\n'));
  }

  var ui = SpreadsheetApp.getUi();
  var confirmation = ui.alert(
    'Commit English BOW review import?',
    initialReport.text +
    '\n\nAffected tuples:\n' + initialReport.tupleSummary.join('\n') +
    '\n\nThis will append exactly 1,372 review-only rows. Grade 2 English Second Term will remain blocked. It will not activate SUPPORT_MATRIX.',
    ui.ButtonSet.YES_NO
  );
  if (confirmation !== ui.Button.YES) {
    return { committed: false, reason: 'Cancelled by user.' };
  }

  var result = withScriptLock_(function () {
    var report = buildEnglishBowImportDryRun_();
    if (!report.valid) {
      throw new Error(
        'English BOW import dry run failed after acquiring the script lock:\n' +
        report.errors.join('\n')
      );
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var bowSheet = requireExistingSheet_(spreadsheet, SHEET_NAMES.BOW_DATABASE);
    var auditSheet = requireExistingSheet_(spreadsheet, BOW_MATH_IMPORT_AUDIT_SHEET_);
    assertExactSheetHeaders_(
      auditSheet,
      BOW_MATH_IMPORT_AUDIT_HEADERS_,
      BOW_MATH_IMPORT_AUDIT_SHEET_
    );

    var timestamp = Utilities.formatDate(
      now_(),
      Session.getScriptTimeZone(),
      'yyyyMMdd_HHmmss'
    );
    var importBatch = 'ENGLISH_REVIEW_' + timestamp;
    var bowBackup = createImportBackupSheet_(
      spreadsheet,
      bowSheet,
      'BOW_DATABASE_BACKUP_ENGLISH_' + timestamp
    );
    var auditBackup = createImportBackupSheet_(
      spreadsheet,
      auditSheet,
      'BOW_AUDIT_BACKUP_ENGLISH_' + timestamp
    );
    var beforeState = captureEnglishBowImportState_(
      spreadsheet,
      bowSheet,
      auditSheet
    );

    try {
      appendEnglishBowImportRows_(bowSheet, report.sourceData);
      appendEnglishBowAuditRows_(auditSheet, report.sourceData, importBatch);
      SpreadsheetApp.flush();

      var validation = validateCommittedEnglishBowImport_({
        spreadsheet: spreadsheet,
        bowSheet: bowSheet,
        auditSheet: auditSheet,
        sourceRows: report.sourceData,
        importBatch: importBatch,
        beforeState: beforeState
      });
      if (!validation.valid) {
        throw new Error(
          'Post-import validation failed:\n' + validation.errors.join('\n')
        );
      }

      return {
        committed: true,
        importBatch: importBatch,
        importedRows: report.sourceData.length,
        bowBackupSheet: bowBackup.getName(),
        auditBackupSheet: auditBackup.getName(),
        validationText: validation.text
      };
    } catch (err) {
      restoreSheetFromImportBackup_(bowSheet, bowBackup);
      restoreSheetFromImportBackup_(auditSheet, auditBackup);
      SpreadsheetApp.flush();
      throw new Error(
        'English BOW import was rolled back. Backup sheets and staging data were retained. ' +
        (err && err.message ? err.message : String(err))
      );
    }
  }, 30000);

  ui.alert(
    'English BOW review import completed.\n\n' +
    'Batch: ' + result.importBatch + '\n' +
    'Imported rows: ' + result.importedRows + '\n' +
    'BOW backup: ' + result.bowBackupSheet + '\n' +
    'Audit backup: ' + result.auditBackupSheet + '\n\n' +
    result.validationText
  );
  return result;
}

function buildEnglishBowImportDryRun_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var errors = [];
  var stagingSheet = spreadsheet.getSheetByName(
    BOW_ENGLISH_IMPORT_STAGING_SHEET_
  );

  if (!stagingSheet) {
    return createEnglishBowImportReport_(
      [
        'Missing staging sheet: ' + BOW_ENGLISH_IMPORT_STAGING_SHEET_ +
        '. Run prepareEnglishBowImportStaging and import the reviewed CSV first.'
      ],
      [],
      0
    );
  }

  try {
    assertExactSheetHeaders_(
      stagingSheet,
      BOW_MATH_IMPORT_HEADERS_,
      BOW_ENGLISH_IMPORT_STAGING_SHEET_
    );
  } catch (err) {
    errors.push(err.message);
  }

  var sourceRows = readEnglishBowStagingRows_(stagingSheet);
  if (sourceRows.length !== BOW_ENGLISH_IMPORT_EXPECTED_SOURCE_ROWS_) {
    errors.push(
      'Expected exactly ' + BOW_ENGLISH_IMPORT_EXPECTED_SOURCE_ROWS_ +
      ' source rows, found ' + sourceRows.length + '.'
    );
  }

  validateEnglishBowSourceRows_(sourceRows, errors);
  validateEnglishBowExpectedTuples_(sourceRows, errors);
  validateEnglishRowsAgainstLiveData_(spreadsheet, sourceRows, errors);
  validateEnglishTuplesInactive_(sourceRows, errors);

  return createEnglishBowImportReport_(
    errors,
    sourceRows,
    sourceRows.length
  );
}

function readEnglishBowStagingRows_(sheet) {
  if (sheet.getLastRow() < 2) {
    return [];
  }

  var values = sheet.getRange(
    2,
    1,
    sheet.getLastRow() - 1,
    BOW_MATH_IMPORT_HEADERS_.length
  ).getValues();
  return values.map(function (row) {
    var object = {};
    BOW_MATH_IMPORT_HEADERS_.forEach(function (header, index) {
      object[header] = row[index];
    });
    return object;
  });
}

function validateEnglishBowSourceRows_(rows, errors) {
  var requiredFields = BOW_MATH_IMPORT_HEADERS_;
  var seenIds = {};

  rows.forEach(function (row, index) {
    var rowLabel = 'Staging row ' + (index + 2);
    requiredFields.forEach(function (fieldName) {
      if (!String(row[fieldName] || '').trim()) {
        errors.push(rowLabel + ' is missing ' + fieldName + '.');
      }
    });

    var bowId = String(row.BOW_ID || '').trim();
    var bowIdKey = normalizeForMatch_(bowId);
    if (bowIdKey) {
      if (seenIds[bowIdKey]) {
        errors.push('Duplicate source BOW_ID: ' + bowId + '.');
      }
      seenIds[bowIdKey] = true;
    }

    validateEnglishBowIdentity_(row, rowLabel, errors);
    validateEnglishConstructedPacingNote_(row, rowLabel, errors);
  });
}

function validateEnglishBowIdentity_(row, rowLabel, errors) {
  if (String(row.Subject || '').trim() !== 'English') {
    errors.push(rowLabel + ' must use Subject "English".');
  }

  var gradeMatch = String(row.GradeLevel || '').trim().match(/^Grade (11|10|[1-9])$/);
  if (!gradeMatch) {
    errors.push(rowLabel + ' has invalid GradeLevel: ' + row.GradeLevel + '.');
    return;
  }

  var grade = Number(gradeMatch[1]);
  var term = String(row.Term || '').trim();
  var termNumbers = {
    'First Term': 1,
    'Second Term': 2,
    'Third Term': 3
  };
  var termNumber = termNumbers[term];
  if (!termNumber) {
    errors.push(rowLabel + ' has invalid Term: ' + row.Term + '.');
    return;
  }

  var weekText = String(row.WeekNumber || '').trim();
  if (
    !/^\d+$/.test(weekText) ||
    Number(weekText) < 1 ||
    Number(weekText) > 10
  ) {
    errors.push(rowLabel + ' has invalid WeekNumber: ' + row.WeekNumber + '.');
    return;
  }

  var bowId = String(row.BOW_ID || '').trim();
  var idMatch = bowId.match(
    /^BOW-G(11|10|[1-9])-ENG-T([123])-W(10|[1-9])(?:-([A-Z]))?$/
  );
  if (!idMatch) {
    errors.push(
      rowLabel + ' has invalid English BOW_ID format: ' + row.BOW_ID + '.'
    );
    return;
  }
  if (
    Number(idMatch[1]) !== grade ||
    Number(idMatch[2]) !== termNumber ||
    Number(idMatch[3]) !== Number(weekText)
  ) {
    errors.push(
      rowLabel + ' BOW_ID does not match its GradeLevel, Term, and WeekNumber: ' +
      row.BOW_ID + '.'
    );
  }
}

function validateEnglishConstructedPacingNote_(row, rowLabel, errors) {
  if (
    String(row.ExtractionNotes || '').indexOf(
      BOW_ENGLISH_IMPORT_CONSTRUCTED_PACING_NOTE_
    ) === -1
  ) {
    errors.push(
      rowLabel +
      ' ExtractionNotes must contain: ' +
      BOW_ENGLISH_IMPORT_CONSTRUCTED_PACING_NOTE_
    );
  }
}

function validateEnglishBowExpectedTuples_(rows, errors) {
  var expectedByKey = {};
  var actualByKey = {};
  var termCounts = {};

  BOW_ENGLISH_IMPORT_EXPECTED_TUPLES_.forEach(function (expected) {
    expectedByKey[englishImportTupleKey_(
      expected.GradeLevel,
      'English',
      expected.Term
    )] = expected;
  });

  rows.forEach(function (row) {
    var key = englishImportTupleKey_(row.GradeLevel, row.Subject, row.Term);
    actualByKey[key] = actualByKey[key] || [];
    actualByKey[key].push(row);
    var term = String(row.Term || '').trim();
    termCounts[term] = (termCounts[term] || 0) + 1;
  });

  if (Object.keys(actualByKey).length !== BOW_ENGLISH_IMPORT_EXPECTED_TUPLES_.length) {
    errors.push(
      'Expected exactly ' + BOW_ENGLISH_IMPORT_EXPECTED_TUPLES_.length +
      ' populated English grade/term tuples, found ' +
      Object.keys(actualByKey).length + '.'
    );
  }

  Object.keys(expectedByKey).forEach(function (key) {
    var expected = expectedByKey[key];
    var actualRows = actualByKey[key] || [];

    if (actualRows.length !== expected.Count) {
      errors.push(
        expected.GradeLevel + ' / English / ' + expected.Term +
        ' expected ' + expected.Count + ' row(s), found ' + actualRows.length + '.'
      );
    }
  });

  Object.keys(actualByKey).forEach(function (key) {
    if (!expectedByKey[key]) {
      var row = actualByKey[key][0];
      errors.push(
        'Unexpected English import tuple: ' +
        row.GradeLevel + ' / ' + row.Subject + ' / ' + row.Term + '.'
      );
    }
  });

  Object.keys(BOW_ENGLISH_IMPORT_EXPECTED_TERM_COUNTS_).forEach(function (term) {
    var expectedCount = BOW_ENGLISH_IMPORT_EXPECTED_TERM_COUNTS_[term];
    var actualCount = termCounts[term] || 0;
    if (actualCount !== expectedCount) {
      errors.push(
        term + ' expected ' + expectedCount +
        ' English row(s), found ' + actualCount + '.'
      );
    }
  });

  var blockedKey = englishImportTupleKey_(
    'Grade 2',
    'English',
    'Second Term'
  );
  if ((actualByKey[blockedKey] || []).length !== 0) {
    errors.push(
      'Grade 2 / English / Second Term must remain blocked with zero rows.'
    );
  }
}

function validateEnglishRowsAgainstLiveData_(spreadsheet, sourceRows, errors) {
  var bowSheet = spreadsheet.getSheetByName(SHEET_NAMES.BOW_DATABASE);
  if (!bowSheet) {
    errors.push('Missing live sheet: ' + SHEET_NAMES.BOW_DATABASE + '.');
    return;
  }

  try {
    assertRequiredHeaders_(bowSheet, BOW_HEADERS, SHEET_NAMES.BOW_DATABASE);
  } catch (err) {
    errors.push(err.message);
    return;
  }

  var auditSheet = spreadsheet.getSheetByName(BOW_MATH_IMPORT_AUDIT_SHEET_);
  if (!auditSheet) {
    errors.push('Missing required audit sheet: ' + BOW_MATH_IMPORT_AUDIT_SHEET_ + '.');
    return;
  }
  try {
    assertExactSheetHeaders_(
      auditSheet,
      BOW_MATH_IMPORT_AUDIT_HEADERS_,
      BOW_MATH_IMPORT_AUDIT_SHEET_
    );
  } catch (err) {
    errors.push(err.message);
    return;
  }

  var existingBowIds = {};
  getSheetObjects_(bowSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      existingBowIds[key] = true;
    }
  });

  var auditedIds = {};
  getSheetObjects_(auditSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      auditedIds[key] = true;
    }
  });

  sourceRows.forEach(function (row) {
    var bowId = String(row.BOW_ID || '').trim();
    var key = normalizeForMatch_(bowId);
    if (existingBowIds[key]) {
      errors.push('Incoming English BOW_ID already exists in BOW_DATABASE: ' + bowId + '.');
    }
    if (auditedIds[key]) {
      errors.push('Incoming English BOW_ID already exists in BOW_DATABASE_AUDIT: ' + bowId + '.');
    }
  });
}

function validateEnglishTuplesInactive_(rows, errors) {
  var checked = {};

  rows.forEach(function (row) {
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    if (checked[key]) {
      return;
    }
    checked[key] = true;

    var support = getSupportStatus_(row);
    if (support.supported) {
      errors.push(
        'English review tuple is already processable and must remain inactive: ' +
        row.GradeLevel + ' / ' + row.Subject + ' / ' + row.Term + '.'
      );
    }
  });
}

function appendEnglishBowImportRows_(bowSheet, sourceRows) {
  var headerMap = getHeaderMap_(bowSheet);
  var lastColumn = bowSheet.getLastColumn();
  var values = sourceRows.map(function (sourceRow) {
    var row = new Array(lastColumn).fill('');
    BOW_HEADERS.forEach(function (header) {
      var value = header === 'Notes'
        ? sourceRow.ExtractionNotes
        : sourceRow[header];
      row[headerMap[header] - 1] = header === 'WeekNumber'
        ? normalizeEnglishComparableText_(value)
        : value;
    });
    return row;
  });

  if (values.length) {
    bowSheet.getRange(
      bowSheet.getLastRow() + 1,
      1,
      values.length,
      lastColumn
    ).setValues(values);
  }
}

function appendEnglishBowAuditRows_(auditSheet, sourceRows, importBatch) {
  var importedAt = now_();
  var values = sourceRows.map(function (row) {
    return [
      row.BOW_ID,
      row.SourceFile,
      normalizeEnglishComparableText_(row.SourcePage),
      row.ExtractionNotes,
      importBatch,
      importedAt
    ];
  });

  if (values.length) {
    var startRow = auditSheet.getLastRow() + 1;
    auditSheet.getRange(startRow, 3, values.length, 1).setNumberFormat('@');
    auditSheet.getRange(
      startRow,
      1,
      values.length,
      values[0].length
    ).setValues(values);
  }
}

function normalizeEnglishComparableText_(value) {
  if (value === null || typeof value === 'undefined') {
    return '';
  }
  return String(value).replace(/\s+/g, ' ').trim();
}

function normalizeEnglishCommittedField_(fieldName, value) {
  if (fieldName === 'WeekNumber' || fieldName === 'SourcePage') {
    return normalizeEnglishComparableText_(value);
  }
  return normalizeImportCell_(value);
}

function captureEnglishBowImportState_(spreadsheet, bowSheet, auditSheet) {
  var bowRows = bowSheet.getDataRange().getValues();
  var auditRows = auditSheet.getDataRange().getValues();
  return {
    bowRowCount: Math.max(bowSheet.getLastRow() - 1, 0),
    bowRegionRows: bowRows.length,
    bowRegionColumns: bowRows[0] ? bowRows[0].length : 1,
    bowChecksum: checksumValues_(bowRows),
    auditRowCount: Math.max(auditSheet.getLastRow() - 1, 0),
    auditRegionRows: auditRows.length,
    auditRegionColumns: auditRows[0] ? auditRows[0].length : 1,
    auditChecksum: checksumValues_(auditRows),
    supportChecksum: checksumSheetData_(
      requireExistingSheet_(spreadsheet, SHEET_NAMES.SUPPORT_MATRIX)
    ),
    profileChecksum: checksumSheetData_(
      requireExistingSheet_(spreadsheet, SHEET_NAMES.SUBJECT_PROFILES)
    )
  };
}

function validateCommittedEnglishBowImport_(context) {
  var errors = [];
  var sourceRows = context.sourceRows;
  var before = context.beforeState;
  var bowRowCountAfter = Math.max(context.bowSheet.getLastRow() - 1, 0);
  var auditRowCountAfter = Math.max(context.auditSheet.getLastRow() - 1, 0);

  if (bowRowCountAfter - before.bowRowCount !== sourceRows.length) {
    errors.push(
      'BOW_DATABASE row count changed by ' +
      (bowRowCountAfter - before.bowRowCount) +
      ', expected ' + sourceRows.length + '.'
    );
  }
  if (auditRowCountAfter - before.auditRowCount !== sourceRows.length) {
    errors.push(
      'BOW_DATABASE_AUDIT row count changed by ' +
      (auditRowCountAfter - before.auditRowCount) +
      ', expected ' + sourceRows.length + '.'
    );
  }

  var existingBowChecksumAfter = checksumValues_(
    context.bowSheet.getRange(
      1,
      1,
      before.bowRegionRows,
      before.bowRegionColumns
    ).getValues()
  );
  if (existingBowChecksumAfter !== before.bowChecksum) {
    errors.push('Pre-existing BOW_DATABASE rows changed during English import.');
  }

  var existingAuditChecksumAfter = checksumValues_(
    context.auditSheet.getRange(
      1,
      1,
      before.auditRegionRows,
      before.auditRegionColumns
    ).getValues()
  );
  if (existingAuditChecksumAfter !== before.auditChecksum) {
    errors.push('Pre-existing BOW_DATABASE_AUDIT rows changed during English import.');
  }

  validateEnglishCommittedBowRows_(context.bowSheet, sourceRows, errors);
  validateEnglishCommittedAuditRows_(
    context.auditSheet,
    sourceRows,
    context.importBatch,
    errors
  );

  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUPPORT_MATRIX)
    ) !== before.supportChecksum
  ) {
    errors.push('SUPPORT_MATRIX changed during English import.');
  }
  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUBJECT_PROFILES)
    ) !== before.profileChecksum
  ) {
    errors.push('SUBJECT_PROFILES changed during English import.');
  }

  validateEnglishTuplesInactive_(sourceRows, errors);

  return createEnglishCommitValidationReport_(errors, sourceRows.length);
}

function validateEnglishCommittedBowRows_(bowSheet, sourceRows, errors) {
  var liveById = {};
  getSheetObjects_(bowSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      liveById[key] = liveById[key] || [];
      liveById[key].push(row);
    }
  });

  sourceRows.forEach(function (sourceRow) {
    var matches = liveById[normalizeForMatch_(sourceRow.BOW_ID)] || [];
    if (matches.length !== 1) {
      errors.push(
        'Expected exactly one imported BOW_DATABASE row for ' +
        sourceRow.BOW_ID + ', found ' + matches.length + '.'
      );
      return;
    }

    var liveRow = matches[0];
    BOW_HEADERS.forEach(function (header) {
      var expected = header === 'Notes'
        ? sourceRow.ExtractionNotes
        : sourceRow[header];
      if (
        normalizeEnglishCommittedField_(header, liveRow[header]) !==
        normalizeEnglishCommittedField_(header, expected)
      ) {
        errors.push(
          sourceRow.BOW_ID +
          ' does not match staging field ' + header + '.'
        );
      }
    });
  });
}

function validateEnglishCommittedAuditRows_(
  auditSheet,
  sourceRows,
  importBatch,
  errors
) {
  var auditMatches = {};
  getSheetObjects_(auditSheet).forEach(function (row) {
    if (String(row.ImportBatch || '') !== importBatch) {
      return;
    }
    var key = normalizeForMatch_(row.BOW_ID);
    auditMatches[key] = auditMatches[key] || [];
    auditMatches[key].push(row);
  });

  sourceRows.forEach(function (sourceRow) {
    var matches = auditMatches[normalizeForMatch_(sourceRow.BOW_ID)] || [];
    if (matches.length !== 1) {
      errors.push(
        'Expected exactly one audit row for ' +
        sourceRow.BOW_ID + ' in batch ' + importBatch +
        ', found ' + matches.length + '.'
      );
      return;
    }

    ['SourceFile', 'SourcePage', 'ExtractionNotes'].forEach(function (header) {
      if (
        normalizeEnglishCommittedField_(header, matches[0][header]) !==
        normalizeEnglishCommittedField_(header, sourceRow[header])
      ) {
        errors.push(
          sourceRow.BOW_ID +
          ' audit field does not match staging: ' + header + '.'
        );
      }
    });
  });

  if (Object.keys(auditMatches).reduce(function (count, key) {
    return count + auditMatches[key].length;
  }, 0) !== sourceRows.length) {
    errors.push(
      'Audit batch ' + importBatch +
      ' does not contain exactly ' + sourceRows.length + ' row(s).'
    );
  }
}

function createEnglishCommitValidationReport_(errors, importedRows) {
  var valid = errors.length === 0;
  var lines = [
    valid
      ? 'English BOW post-import validation passed.'
      : 'English BOW post-import validation failed.',
    'Imported review-only rows: ' + importedRows,
    'SUPPORT_MATRIX activation changes: 0',
    'SUBJECT_PROFILES changes: 0',
    'Validation errors: ' + errors.length
  ];
  if (errors.length) {
    lines.push('', errors.slice(0, 20).join('\n'));
  }
  return {
    valid: valid,
    errors: errors,
    text: lines.join('\n')
  };
}

function createEnglishBowImportReport_(errors, sourceRows, sourceRowCount) {
  var valid = errors.length === 0;
  var detectedTuples = {};
  sourceRows.forEach(function (row) {
    detectedTuples[englishImportTupleKey_(
      row.GradeLevel,
      row.Subject,
      row.Term
    )] = true;
  });
  var tupleSummary = BOW_ENGLISH_IMPORT_EXPECTED_TUPLES_.map(function (expected) {
    return expected.GradeLevel + ' / English / ' + expected.Term +
      ': ' + expected.Count + ' row(s)';
  });
  var noteCount = sourceRows.filter(function (row) {
    return String(row.ExtractionNotes || '').indexOf(
      BOW_ENGLISH_IMPORT_CONSTRUCTED_PACING_NOTE_
    ) !== -1;
  }).length;
  var blockedRowCount = sourceRows.filter(function (row) {
    return (
      String(row.GradeLevel || '').trim() === 'Grade 2' &&
      String(row.Subject || '').trim() === 'English' &&
      String(row.Term || '').trim() === 'Second Term'
    );
  }).length;
  var lines = [
    valid
      ? 'English BOW import dry run passed.'
      : 'English BOW import dry run failed.',
    'Source rows: ' + sourceRowCount +
      ' / ' + BOW_ENGLISH_IMPORT_EXPECTED_SOURCE_ROWS_,
    'Detected populated English grade/term tuples: ' +
      Object.keys(detectedTuples).length +
      ' / ' + BOW_ENGLISH_IMPORT_EXPECTED_TUPLES_.length,
    'Grade 2 / English / Second Term rows: ' + blockedRowCount + ' / 0',
    'Constructed-pacing notes present: ' + noteCount +
      ' / ' + sourceRowCount,
    'English review rows eligible to append: ' +
      (valid ? sourceRows.length : 0),
    'Validation errors: ' + errors.length
  ];

  if (errors.length) {
    lines.push('', errors.slice(0, 20).join('\n'));
    if (errors.length > 20) {
      lines.push('Additional errors omitted: ' + (errors.length - 20) + '.');
    }
  }

  return {
    valid: valid,
    errors: errors,
    sourceRows: sourceRowCount,
    sourceData: sourceRows,
    tupleSummary: tupleSummary,
    text: lines.join('\n')
  };
}

function englishImportTupleKey_(gradeLevel, subject, term) {
  return [
    normalizeForMatch_(gradeLevel),
    normalizeForMatch_(subject),
    normalizeForMatch_(term)
  ].join('|');
}

function prepareEnglishG2T2SupplementImportStaging() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(
    BOW_ENGLISH_G2_T2_SUPPLEMENT_STAGING_SHEET_
  );

  if (!sheet) {
    sheet = spreadsheet.insertSheet(BOW_ENGLISH_G2_T2_SUPPLEMENT_STAGING_SHEET_);
    sheet.getRange(1, 1, 1, BOW_MATH_IMPORT_HEADERS_.length)
      .setValues([BOW_MATH_IMPORT_HEADERS_]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() > 1) {
    throw new Error(
      BOW_ENGLISH_G2_T2_SUPPLEMENT_STAGING_SHEET_ +
      ' already contains data. It was not cleared or overwritten.'
    );
  } else {
    assertExactSheetHeaders_(
      sheet,
      BOW_MATH_IMPORT_HEADERS_,
      BOW_ENGLISH_G2_T2_SUPPLEMENT_STAGING_SHEET_
    );
  }

  SpreadsheetApp.getUi().alert(
    BOW_ENGLISH_G2_T2_SUPPLEMENT_STAGING_SHEET_ +
    ' is ready. Import the reviewed Grade 2 English Second Term supplement CSV without changing its headers, then run dryRunEnglishG2T2SupplementImport.'
  );
}

function dryRunEnglishG2T2SupplementImport() {
  var report = buildEnglishG2T2SupplementImportDryRun_();
  Logger.log(report.text);
  SpreadsheetApp.getUi().alert(report.text);
  return report;
}

function commitEnglishG2T2SupplementImport() {
  var initialReport = buildEnglishG2T2SupplementImportDryRun_();
  if (!initialReport.valid) {
    throw new Error(
      'Grade 2 English Second Term supplement dry run failed:\n' +
      initialReport.errors.join('\n')
    );
  }

  var ui = SpreadsheetApp.getUi();
  var confirmation = ui.alert(
    'Commit Grade 2 English Second Term supplement import?',
    initialReport.text +
    '\n\nThis will append exactly 57 review-only supplement rows. It will not activate SUPPORT_MATRIX.',
    ui.ButtonSet.YES_NO
  );
  if (confirmation !== ui.Button.YES) {
    return { committed: false, reason: 'Cancelled by user.' };
  }

  var result = withScriptLock_(function () {
    var report = buildEnglishG2T2SupplementImportDryRun_();
    if (!report.valid) {
      throw new Error(
        'Grade 2 English Second Term supplement dry run failed after acquiring the script lock:\n' +
        report.errors.join('\n')
      );
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var bowSheet = requireExistingSheet_(spreadsheet, SHEET_NAMES.BOW_DATABASE);
    var auditSheet = requireExistingSheet_(spreadsheet, BOW_MATH_IMPORT_AUDIT_SHEET_);
    assertExactSheetHeaders_(
      auditSheet,
      BOW_MATH_IMPORT_AUDIT_HEADERS_,
      BOW_MATH_IMPORT_AUDIT_SHEET_
    );

    var timestamp = Utilities.formatDate(
      now_(),
      Session.getScriptTimeZone(),
      'yyyyMMdd_HHmmss'
    );
    var importBatch = 'ENGLISH_G2_T2_SUPPLEMENT_REVIEW_' + timestamp;
    var bowBackup = createImportBackupSheet_(
      spreadsheet,
      bowSheet,
      'BOW_DATABASE_BACKUP_ENGLISH_G2_T2_SUPPLEMENT_' + timestamp
    );
    var auditBackup = createImportBackupSheet_(
      spreadsheet,
      auditSheet,
      'BOW_AUDIT_BACKUP_ENGLISH_G2_T2_SUPPLEMENT_' + timestamp
    );
    var beforeState = captureEnglishBowImportState_(
      spreadsheet,
      bowSheet,
      auditSheet
    );

    try {
      appendEnglishBowImportRows_(bowSheet, report.sourceData);
      appendEnglishBowAuditRows_(auditSheet, report.sourceData, importBatch);
      SpreadsheetApp.flush();

      var validation = validateCommittedEnglishBowImport_({
        spreadsheet: spreadsheet,
        bowSheet: bowSheet,
        auditSheet: auditSheet,
        sourceRows: report.sourceData,
        importBatch: importBatch,
        beforeState: beforeState
      });
      if (!validation.valid) {
        throw new Error(
          'Post-import validation failed:\n' + validation.errors.join('\n')
        );
      }

      return {
        committed: true,
        importBatch: importBatch,
        importedRows: report.sourceData.length,
        bowBackupSheet: bowBackup.getName(),
        auditBackupSheet: auditBackup.getName(),
        validationText: validation.text
      };
    } catch (err) {
      restoreSheetFromImportBackup_(bowSheet, bowBackup);
      restoreSheetFromImportBackup_(auditSheet, auditBackup);
      SpreadsheetApp.flush();
      throw new Error(
        'Grade 2 English Second Term supplement import was rolled back. Backup sheets and staging data were retained. ' +
        (err && err.message ? err.message : String(err))
      );
    }
  }, 30000);

  ui.alert(
    'Grade 2 English Second Term supplement import completed.\n\n' +
    'Batch: ' + result.importBatch + '\n' +
    'Imported rows: ' + result.importedRows + '\n' +
    'BOW backup: ' + result.bowBackupSheet + '\n' +
    'Audit backup: ' + result.auditBackupSheet + '\n\n' +
    result.validationText
  );
  return result;
}

function buildEnglishG2T2SupplementImportDryRun_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var errors = [];
  var stagingSheet = spreadsheet.getSheetByName(
    BOW_ENGLISH_G2_T2_SUPPLEMENT_STAGING_SHEET_
  );

  if (!stagingSheet) {
    return createEnglishG2T2SupplementImportReport_(
      [
        'Missing staging sheet: ' +
        BOW_ENGLISH_G2_T2_SUPPLEMENT_STAGING_SHEET_ +
        '. Run prepareEnglishG2T2SupplementImportStaging and import the reviewed supplement CSV first.'
      ],
      [],
      0
    );
  }

  try {
    assertExactSheetHeaders_(
      stagingSheet,
      BOW_MATH_IMPORT_HEADERS_,
      BOW_ENGLISH_G2_T2_SUPPLEMENT_STAGING_SHEET_
    );
  } catch (err) {
    errors.push(err.message);
  }

  var sourceRows = readEnglishBowStagingRows_(stagingSheet);
  if (sourceRows.length !== BOW_ENGLISH_G2_T2_SUPPLEMENT_EXPECTED_SOURCE_ROWS_) {
    errors.push(
      'Expected exactly ' +
      BOW_ENGLISH_G2_T2_SUPPLEMENT_EXPECTED_SOURCE_ROWS_ +
      ' source rows, found ' + sourceRows.length + '.'
    );
  }

  validateEnglishG2T2SupplementSourceRows_(sourceRows, errors);
  validateEnglishRowsAgainstLiveData_(spreadsheet, sourceRows, errors);
  validateEnglishTuplesInactive_(sourceRows, errors);

  return createEnglishG2T2SupplementImportReport_(
    errors,
    sourceRows,
    sourceRows.length
  );
}

function validateEnglishG2T2SupplementSourceRows_(rows, errors) {
  var seenIds = {};
  var seenWeeks = {};

  rows.forEach(function (row, index) {
    var rowLabel = 'Staging row ' + (index + 2);
    BOW_MATH_IMPORT_HEADERS_.forEach(function (fieldName) {
      if (!String(row[fieldName] || '').trim()) {
        errors.push(rowLabel + ' is missing ' + fieldName + '.');
      }
    });

    var bowId = String(row.BOW_ID || '').trim();
    var bowIdKey = normalizeForMatch_(bowId);
    if (bowIdKey) {
      if (seenIds[bowIdKey]) {
        errors.push('Duplicate source BOW_ID: ' + bowId + '.');
      }
      seenIds[bowIdKey] = true;
    }

    validateEnglishG2T2SupplementIdentity_(row, rowLabel, errors);
    validateEnglishG2T2SupplementReviewFields_(row, rowLabel, errors);

    var weekText = String(row.WeekNumber || '').trim();
    if (/^\d+$/.test(weekText)) {
      seenWeeks[weekText] = true;
    }
  });

  for (var week = 1; week <= 10; week++) {
    if (!seenWeeks[String(week)]) {
      errors.push('Grade 2 English Second Term supplement is missing WeekNumber ' + week + '.');
    }
  }
}

function validateEnglishG2T2SupplementIdentity_(row, rowLabel, errors) {
  if (String(row.Subject || '').trim() !== 'English') {
    errors.push(rowLabel + ' must use Subject "English".');
  }
  if (String(row.GradeLevel || '').trim() !== 'Grade 2') {
    errors.push(rowLabel + ' must use GradeLevel "Grade 2".');
  }
  if (String(row.Term || '').trim() !== 'Second Term') {
    errors.push(rowLabel + ' must use Term "Second Term".');
  }

  var weekText = String(row.WeekNumber || '').trim();
  if (
    !/^\d+$/.test(weekText) ||
    Number(weekText) < 1 ||
    Number(weekText) > 10
  ) {
    errors.push(rowLabel + ' has invalid WeekNumber: ' + row.WeekNumber + '.');
    return;
  }

  var bowId = String(row.BOW_ID || '').trim();
  var idMatch = bowId.match(/^BOW-G2-ENG-T2-W(10|[1-9])(?:-([A-Z]))?$/);
  if (!idMatch) {
    errors.push(
      rowLabel +
      ' has invalid Grade 2 English Second Term supplement BOW_ID format: ' +
      row.BOW_ID + '.'
    );
    return;
  }
  if (Number(idMatch[1]) !== Number(weekText)) {
    errors.push(
      rowLabel + ' BOW_ID does not match its WeekNumber: ' + row.BOW_ID + '.'
    );
  }
}

function validateEnglishG2T2SupplementReviewFields_(row, rowLabel, errors) {
  if (
    String(row.PerformanceStandard || '').indexOf(
      BOW_ENGLISH_G2_T2_SUPPLEMENT_PERFORMANCE_PREFIX_
    ) !== 0
  ) {
    errors.push(
      rowLabel +
      ' PerformanceStandard must start with: ' +
      BOW_ENGLISH_G2_T2_SUPPLEMENT_PERFORMANCE_PREFIX_
    );
  }

  if (
    String(row.ExtractionNotes || '').indexOf(
      BOW_ENGLISH_G2_T2_SUPPLEMENT_NOTE_
    ) === -1
  ) {
    errors.push(
      rowLabel +
      ' ExtractionNotes must contain: ' +
      BOW_ENGLISH_G2_T2_SUPPLEMENT_NOTE_
    );
  }
}

function createEnglishG2T2SupplementImportReport_(errors, sourceRows, sourceRowCount) {
  var valid = errors.length === 0;
  var noteCount = sourceRows.filter(function (row) {
    return String(row.ExtractionNotes || '').indexOf(
      BOW_ENGLISH_G2_T2_SUPPLEMENT_NOTE_
    ) !== -1;
  }).length;
  var performancePrefixCount = sourceRows.filter(function (row) {
    return String(row.PerformanceStandard || '').indexOf(
      BOW_ENGLISH_G2_T2_SUPPLEMENT_PERFORMANCE_PREFIX_
    ) === 0;
  }).length;

  var lines = [
    valid
      ? 'Grade 2 English Second Term supplement dry run passed.'
      : 'Grade 2 English Second Term supplement dry run failed.',
    'Source rows: ' + sourceRowCount +
      ' / ' + BOW_ENGLISH_G2_T2_SUPPLEMENT_EXPECTED_SOURCE_ROWS_,
    'Required PerformanceStandard prefix present: ' +
      performancePrefixCount + ' / ' + sourceRowCount,
    'Supplement review notes present: ' + noteCount + ' / ' + sourceRowCount,
    'Supplement rows eligible to append: ' + (valid ? sourceRows.length : 0),
    'SUPPORT_MATRIX activation changes: 0',
    'SUBJECT_PROFILES changes: 0',
    'Validation errors: ' + errors.length
  ];

  if (errors.length) {
    lines.push('', errors.slice(0, 20).join('\n'));
    if (errors.length > 20) {
      lines.push('Additional errors omitted: ' + (errors.length - 20) + '.');
    }
  }

  return {
    valid: valid,
    errors: errors,
    sourceRows: sourceRowCount,
    sourceData: sourceRows,
    text: lines.join('\n')
  };
}

function prepareScienceBowImportStaging() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(BOW_SCIENCE_IMPORT_STAGING_SHEET_);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(BOW_SCIENCE_IMPORT_STAGING_SHEET_);
    sheet.getRange(1, 1, 1, BOW_MATH_IMPORT_HEADERS_.length)
      .setValues([BOW_MATH_IMPORT_HEADERS_]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() > 1) {
    throw new Error(
      BOW_SCIENCE_IMPORT_STAGING_SHEET_ +
      ' already contains data. It was not cleared or overwritten.'
    );
  } else {
    assertExactSheetHeaders_(
      sheet,
      BOW_MATH_IMPORT_HEADERS_,
      BOW_SCIENCE_IMPORT_STAGING_SHEET_
    );
  }

  SpreadsheetApp.getUi().alert(
    BOW_SCIENCE_IMPORT_STAGING_SHEET_ +
    ' is ready. Import the reviewed Science CSV without changing its headers, then run dryRunScienceBowImport.'
  );
}

function dryRunScienceBowImport() {
  var report = buildScienceBowImportDryRun_();
  Logger.log(report.text);
  SpreadsheetApp.getUi().alert(report.text);
  return report;
}

function commitScienceBowImport() {
  var initialReport = buildScienceBowImportDryRun_();
  if (!initialReport.valid) {
    throw new Error('Science BOW import dry run failed:\n' + initialReport.errors.join('\n'));
  }

  var ui = SpreadsheetApp.getUi();
  var confirmation = ui.alert(
    'Commit Science BOW review import?',
    initialReport.text +
    '\n\nGrade totals:\n' + initialReport.gradeSummary.join('\n') +
    '\n\nTerm totals:\n' + initialReport.termSummary.join('\n') +
    '\n\nThis will append exactly 134 review rows across 27 inactive tuples. It will not activate SUPPORT_MATRIX.',
    ui.ButtonSet.YES_NO
  );
  if (confirmation !== ui.Button.YES) {
    return { committed: false, reason: 'Cancelled by user.' };
  }

  var result = withScriptLock_(function () {
    var report = buildScienceBowImportDryRun_();
    if (!report.valid) {
      throw new Error(
        'Science BOW import dry run failed after acquiring the script lock:\n' +
        report.errors.join('\n')
      );
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var bowSheet = requireExistingSheet_(spreadsheet, SHEET_NAMES.BOW_DATABASE);
    var auditSheet = requireExistingSheet_(spreadsheet, BOW_MATH_IMPORT_AUDIT_SHEET_);
    assertExactSheetHeaders_(
      auditSheet,
      BOW_MATH_IMPORT_AUDIT_HEADERS_,
      BOW_MATH_IMPORT_AUDIT_SHEET_
    );

    var timestamp = Utilities.formatDate(
      now_(),
      Session.getScriptTimeZone(),
      'yyyyMMdd_HHmmss'
    );
    var importBatch = 'SCIENCE_REVIEW_' + timestamp;
    var bowBackup = createImportBackupSheet_(
      spreadsheet,
      bowSheet,
      'BOW_DATABASE_BACKUP_SCIENCE_' + timestamp
    );
    var auditBackup = createImportBackupSheet_(
      spreadsheet,
      auditSheet,
      'BOW_AUDIT_BACKUP_SCIENCE_' + timestamp
    );
    var beforeState = captureEnglishBowImportState_(
      spreadsheet,
      bowSheet,
      auditSheet
    );

    try {
      appendScienceBowImportRows_(bowSheet, report.sourceData);
      appendMathBowAuditRows_(auditSheet, report.sourceData, importBatch);
      SpreadsheetApp.flush();

      var validation = validateCommittedScienceBowImport_({
        spreadsheet: spreadsheet,
        bowSheet: bowSheet,
        auditSheet: auditSheet,
        sourceRows: report.sourceData,
        importBatch: importBatch,
        beforeState: beforeState
      });
      if (!validation.valid) {
        throw new Error(
          'Post-import validation failed:\n' + validation.errors.join('\n')
        );
      }

      return {
        committed: true,
        importBatch: importBatch,
        importedRows: report.sourceData.length,
        bowBackupSheet: bowBackup.getName(),
        auditBackupSheet: auditBackup.getName(),
        validationText: validation.text
      };
    } catch (err) {
      restoreSheetFromImportBackup_(bowSheet, bowBackup);
      restoreSheetFromImportBackup_(auditSheet, auditBackup);
      SpreadsheetApp.flush();
      throw new Error(
        'Science BOW import was rolled back. Backup sheets and staging data were retained. ' +
        (err && err.message ? err.message : String(err))
      );
    }
  }, 30000);

  ui.alert(
    'Science BOW review import completed.\n\n' +
    'Batch: ' + result.importBatch + '\n' +
    'Imported rows: ' + result.importedRows + '\n' +
    'BOW backup: ' + result.bowBackupSheet + '\n' +
    'Audit backup: ' + result.auditBackupSheet + '\n\n' +
    result.validationText
  );
  return result;
}

function buildScienceBowImportDryRun_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var errors = [];
  var stagingSheet = spreadsheet.getSheetByName(
    BOW_SCIENCE_IMPORT_STAGING_SHEET_
  );

  if (!stagingSheet) {
    return createScienceBowImportReport_(
      [
        'Missing staging sheet: ' + BOW_SCIENCE_IMPORT_STAGING_SHEET_ +
        '. Run prepareScienceBowImportStaging and import the reviewed CSV first.'
      ],
      [],
      0
    );
  }

  try {
    assertExactSheetHeaders_(
      stagingSheet,
      BOW_MATH_IMPORT_HEADERS_,
      BOW_SCIENCE_IMPORT_STAGING_SHEET_
    );
  } catch (err) {
    errors.push(err.message);
  }

  var sourceRows = readScienceBowStagingRows_(stagingSheet);
  if (sourceRows.length !== BOW_SCIENCE_IMPORT_EXPECTED_SOURCE_ROWS_) {
    errors.push(
      'Expected exactly ' + BOW_SCIENCE_IMPORT_EXPECTED_SOURCE_ROWS_ +
      ' source rows, found ' + sourceRows.length + '.'
    );
  }

  validateScienceBowSourceRows_(sourceRows, errors);
  validateScienceBowExpectedCounts_(sourceRows, errors);
  validateScienceMergedWeekRow_(sourceRows, errors);
  validateScienceRowsAgainstLiveData_(spreadsheet, sourceRows, errors);
  validateScienceTuplesInactive_(sourceRows, errors);

  return createScienceBowImportReport_(errors, sourceRows, sourceRows.length);
}

function readScienceBowStagingRows_(sheet) {
  if (sheet.getLastRow() < 2) {
    return [];
  }

  var values = sheet.getRange(
    2,
    1,
    sheet.getLastRow() - 1,
    BOW_MATH_IMPORT_HEADERS_.length
  ).getValues();
  return values.map(function (row) {
    var object = {};
    BOW_MATH_IMPORT_HEADERS_.forEach(function (header, index) {
      object[header] = row[index];
    });
    return object;
  });
}

function validateScienceBowSourceRows_(rows, errors) {
  var requiredFields = [
    'BOW_ID',
    'GradeLevel',
    'Subject',
    'Term',
    'WeekNumber',
    'Domain',
    'ContentStandard',
    'PerformanceStandard',
    'LearningCompetency',
    'SourceFile',
    'SourcePage'
  ];
  var seenIds = {};

  rows.forEach(function (row, index) {
    var rowLabel = 'Staging row ' + (index + 2);
    requiredFields.forEach(function (fieldName) {
      if (!String(row[fieldName] || '').trim()) {
        errors.push(rowLabel + ' is missing ' + fieldName + '.');
      }
    });

    var bowId = String(row.BOW_ID || '').trim();
    var bowIdKey = normalizeForMatch_(bowId);
    if (bowIdKey) {
      if (seenIds[bowIdKey]) {
        errors.push('Duplicate source BOW_ID: ' + bowId + '.');
      }
      seenIds[bowIdKey] = true;
    }

    if (
      /Suggested\s+Activities|Suggested\s+Performance\s+Tasks?/i.test(
        String(row.LearningCompetency || '')
      )
    ) {
      errors.push(
        rowLabel +
        ' LearningCompetency contains Suggested Activities or Suggested Performance Tasks.'
      );
    }

    validateScienceBowIdentity_(row, rowLabel, errors);
  });
}

function validateScienceBowIdentity_(row, rowLabel, errors) {
  var gradeMatch = String(row.GradeLevel || '').trim().match(/^Grade (10|11|[3-9])$/);
  if (!gradeMatch) {
    errors.push(rowLabel + ' has invalid GradeLevel: ' + row.GradeLevel + '.');
    return;
  }

  var grade = Number(gradeMatch[1]);
  var expectedSubject = grade === 11 ? 'General Science' : 'Science';
  var expectedCode = grade === 11 ? 'GENSCI' : 'SCI';
  if (String(row.Subject || '').trim() !== expectedSubject) {
    errors.push(rowLabel + ' must use Subject "' + expectedSubject + '".');
  }

  var termNumbers = {
    'First Term': 1,
    'Second Term': 2,
    'Third Term': 3
  };
  var term = String(row.Term || '').trim();
  var termNumber = termNumbers[term];
  if (!termNumber) {
    errors.push(rowLabel + ' has invalid Term: ' + row.Term + '.');
    return;
  }

  var weekMatch = String(row.WeekNumber || '').trim().match(/^(\d+)(?: to (\d+))?$/);
  if (!weekMatch) {
    errors.push(rowLabel + ' has invalid WeekNumber: ' + row.WeekNumber + '.');
    return;
  }

  var weekStart = Number(weekMatch[1]);
  var weekEnd = weekMatch[2] ? Number(weekMatch[2]) : weekStart;
  if (
    weekStart < 1 ||
    weekEnd < weekStart ||
    weekStart > 11 ||
    weekEnd > 11
  ) {
    errors.push(
      rowLabel + ' has invalid WeekNumber range: ' + row.WeekNumber + '.'
    );
    return;
  }

  var weekId = weekMatch[2]
    ? 'W' + weekStart + '-' + weekEnd
    : 'W' + weekStart;
  var expectedId =
    'BOW-G' + grade + '-' + expectedCode + '-T' + termNumber + '-' + weekId;
  if (String(row.BOW_ID || '').trim() !== expectedId) {
    errors.push(
      rowLabel + ' must use BOW_ID ' + expectedId +
      ', found ' + row.BOW_ID + '.'
    );
  }
}

function validateScienceBowExpectedCounts_(rows, errors) {
  var actualTerms = {};
  var actualGrades = {};
  var actualTuples = {};
  var expectedTuples = {};

  rows.forEach(function (row) {
    var term = String(row.Term || '').trim();
    var grade = String(row.GradeLevel || '').trim();
    var tupleKey = scienceImportTupleKey_(grade, term);
    actualTerms[term] = (actualTerms[term] || 0) + 1;
    actualGrades[grade] = (actualGrades[grade] || 0) + 1;
    actualTuples[tupleKey] = (actualTuples[tupleKey] || 0) + 1;
  });

  Object.keys(BOW_SCIENCE_IMPORT_EXPECTED_TERM_COUNTS_).forEach(function (term) {
    var expected = BOW_SCIENCE_IMPORT_EXPECTED_TERM_COUNTS_[term];
    var actual = actualTerms[term] || 0;
    if (actual !== expected) {
      errors.push(
        term + ' expected ' + expected + ' row(s), found ' + actual + '.'
      );
    }
  });
  Object.keys(actualTerms).forEach(function (term) {
    if (!BOW_SCIENCE_IMPORT_EXPECTED_TERM_COUNTS_.hasOwnProperty(term)) {
      errors.push('Unexpected Science import term: ' + term + '.');
    }
  });

  Object.keys(BOW_SCIENCE_IMPORT_EXPECTED_GRADE_COUNTS_).forEach(function (grade) {
    var expected = BOW_SCIENCE_IMPORT_EXPECTED_GRADE_COUNTS_[grade];
    var actual = actualGrades[grade] || 0;
    if (actual !== expected) {
      errors.push(
        grade + ' expected ' + expected + ' row(s), found ' + actual + '.'
      );
    }
  });
  Object.keys(actualGrades).forEach(function (grade) {
    if (!BOW_SCIENCE_IMPORT_EXPECTED_GRADE_COUNTS_.hasOwnProperty(grade)) {
      errors.push('Unexpected Science import grade: ' + grade + '.');
    }
  });

  BOW_SCIENCE_IMPORT_EXPECTED_TUPLES_.forEach(function (expected) {
    var key = scienceImportTupleKey_(expected.GradeLevel, expected.Term);
    expectedTuples[key] = true;
    var actual = actualTuples[key] || 0;
    if (actual !== expected.Count) {
      errors.push(
        expected.GradeLevel + ' / ' + expected.Term +
        ' expected ' + expected.Count + ' row(s), found ' + actual + '.'
      );
    }
  });
  Object.keys(actualTuples).forEach(function (key) {
    if (!expectedTuples[key]) {
      errors.push('Unexpected Science import grade/term tuple: ' + key + '.');
    }
  });
}

function validateScienceMergedWeekRow_(rows, errors) {
  var matches = rows.filter(function (row) {
    return String(row.BOW_ID || '').trim() === 'BOW-G9-SCI-T3-W11';
  });

  if (matches.length !== 1) {
    errors.push(
      'Expected exactly one merged BOW-G9-SCI-T3-W11 row, found ' +
      matches.length + '.'
    );
    return;
  }

  var row = matches[0];
  var expected = {
    GradeLevel: 'Grade 9',
    Subject: 'Science',
    Term: 'Third Term',
    WeekNumber: '11',
    SourceFile: '[G9] Science.pdf',
    SourcePage: '12 to 13'
  };
  Object.keys(expected).forEach(function (fieldName) {
    if (String(row[fieldName] || '').trim() !== expected[fieldName]) {
      errors.push(
        'BOW-G9-SCI-T3-W11 must use ' + fieldName +
        ' "' + expected[fieldName] + '".'
      );
    }
  });

  var notes = String(row.ExtractionNotes || '');
  if (
    !/two separate official source rows labeled Week 11 were merged/i.test(notes) ||
    !/one stable BOW_ID/i.test(notes)
  ) {
    errors.push(
      'BOW-G9-SCI-T3-W11 ExtractionNotes must document that two official Week 11 rows were merged into one stable BOW_ID.'
    );
  }
}

function validateScienceRowsAgainstLiveData_(spreadsheet, sourceRows, errors) {
  var bowSheet = spreadsheet.getSheetByName(SHEET_NAMES.BOW_DATABASE);
  if (!bowSheet) {
    errors.push('Missing live sheet: ' + SHEET_NAMES.BOW_DATABASE + '.');
    return;
  }

  try {
    assertRequiredHeaders_(bowSheet, BOW_HEADERS, SHEET_NAMES.BOW_DATABASE);
  } catch (err) {
    errors.push(err.message);
    return;
  }

  var auditSheet = spreadsheet.getSheetByName(BOW_MATH_IMPORT_AUDIT_SHEET_);
  if (!auditSheet) {
    errors.push('Missing required audit sheet: ' + BOW_MATH_IMPORT_AUDIT_SHEET_ + '.');
    return;
  }
  try {
    assertExactSheetHeaders_(
      auditSheet,
      BOW_MATH_IMPORT_AUDIT_HEADERS_,
      BOW_MATH_IMPORT_AUDIT_SHEET_
    );
  } catch (err) {
    errors.push(err.message);
    return;
  }

  var existingBowIds = {};
  getSheetObjects_(bowSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      existingBowIds[key] = true;
    }
  });

  var auditedIds = {};
  getSheetObjects_(auditSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      auditedIds[key] = true;
    }
  });

  sourceRows.forEach(function (row) {
    var bowId = String(row.BOW_ID || '').trim();
    var key = normalizeForMatch_(bowId);
    if (existingBowIds[key]) {
      errors.push('Incoming Science BOW_ID already exists in BOW_DATABASE: ' + bowId + '.');
    }
    if (auditedIds[key]) {
      errors.push('Incoming Science BOW_ID already exists in BOW_DATABASE_AUDIT: ' + bowId + '.');
    }
  });
}

function validateScienceTuplesInactive_(rows, errors) {
  var checked = {};

  rows.forEach(function (row) {
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    if (checked[key]) {
      return;
    }
    checked[key] = true;

    var support = getSupportStatus_(row);
    if (support.supported) {
      errors.push(
        'Science review tuple is already processable and must remain inactive: ' +
        row.GradeLevel + ' / ' + row.Subject + ' / ' + row.Term + '.'
      );
    }
  });
}

function appendScienceBowImportRows_(bowSheet, sourceRows) {
  var headerMap = getHeaderMap_(bowSheet);
  var lastColumn = bowSheet.getLastColumn();
  var values = sourceRows.map(function (sourceRow) {
    var row = new Array(lastColumn).fill('');
    BOW_HEADERS.forEach(function (header) {
      row[headerMap[header] - 1] = header === 'Notes'
        ? sourceRow.ExtractionNotes
        : sourceRow[header];
    });
    return row;
  });

  if (values.length) {
    bowSheet.getRange(
      bowSheet.getLastRow() + 1,
      1,
      values.length,
      lastColumn
    ).setValues(values);
  }
}

function validateCommittedScienceBowImport_(context) {
  var errors = [];
  var sourceRows = context.sourceRows;
  var before = context.beforeState;
  var bowRowCountAfter = Math.max(context.bowSheet.getLastRow() - 1, 0);
  var auditRowCountAfter = Math.max(context.auditSheet.getLastRow() - 1, 0);

  if (bowRowCountAfter - before.bowRowCount !== sourceRows.length) {
    errors.push(
      'BOW_DATABASE row count changed by ' +
      (bowRowCountAfter - before.bowRowCount) +
      ', expected ' + sourceRows.length + '.'
    );
  }
  if (auditRowCountAfter - before.auditRowCount !== sourceRows.length) {
    errors.push(
      'BOW_DATABASE_AUDIT row count changed by ' +
      (auditRowCountAfter - before.auditRowCount) +
      ', expected ' + sourceRows.length + '.'
    );
  }

  var existingBowChecksumAfter = checksumValues_(
    context.bowSheet.getRange(
      1,
      1,
      before.bowRegionRows,
      before.bowRegionColumns
    ).getValues()
  );
  if (existingBowChecksumAfter !== before.bowChecksum) {
    errors.push('Pre-existing BOW_DATABASE rows changed during Science import.');
  }

  var existingAuditChecksumAfter = checksumValues_(
    context.auditSheet.getRange(
      1,
      1,
      before.auditRegionRows,
      before.auditRegionColumns
    ).getValues()
  );
  if (existingAuditChecksumAfter !== before.auditChecksum) {
    errors.push('Pre-existing BOW_DATABASE_AUDIT rows changed during Science import.');
  }

  validateScienceCommittedBowRows_(context.bowSheet, sourceRows, errors);
  validateScienceCommittedAuditRows_(
    context.auditSheet,
    sourceRows,
    context.importBatch,
    errors
  );

  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUPPORT_MATRIX)
    ) !== before.supportChecksum
  ) {
    errors.push('SUPPORT_MATRIX changed during Science import.');
  }
  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUBJECT_PROFILES)
    ) !== before.profileChecksum
  ) {
    errors.push('SUBJECT_PROFILES changed during Science import.');
  }

  validateScienceTuplesInactive_(sourceRows, errors);
  return createScienceCommitValidationReport_(errors, sourceRows.length);
}

function validateScienceCommittedBowRows_(bowSheet, sourceRows, errors) {
  var liveById = {};
  getSheetObjects_(bowSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      liveById[key] = liveById[key] || [];
      liveById[key].push(row);
    }
  });

  sourceRows.forEach(function (sourceRow) {
    var matches = liveById[normalizeForMatch_(sourceRow.BOW_ID)] || [];
    if (matches.length !== 1) {
      errors.push(
        'Expected exactly one imported BOW_DATABASE row for ' +
        sourceRow.BOW_ID + ', found ' + matches.length + '.'
      );
      return;
    }

    var liveRow = matches[0];
    BOW_HEADERS.forEach(function (header) {
      var expected = header === 'Notes'
        ? sourceRow.ExtractionNotes
        : sourceRow[header];
      if (normalizeImportCell_(liveRow[header]) !== normalizeImportCell_(expected)) {
        errors.push(
          sourceRow.BOW_ID +
          ' does not match staging field ' + header + '.'
        );
      }
    });
  });
}

function validateScienceCommittedAuditRows_(
  auditSheet,
  sourceRows,
  importBatch,
  errors
) {
  var auditMatches = {};
  getSheetObjects_(auditSheet).forEach(function (row) {
    if (String(row.ImportBatch || '') !== importBatch) {
      return;
    }
    var key = normalizeForMatch_(row.BOW_ID);
    auditMatches[key] = auditMatches[key] || [];
    auditMatches[key].push(row);
  });

  sourceRows.forEach(function (sourceRow) {
    var matches = auditMatches[normalizeForMatch_(sourceRow.BOW_ID)] || [];
    if (matches.length !== 1) {
      errors.push(
        'Expected exactly one audit row for ' +
        sourceRow.BOW_ID + ' in batch ' + importBatch +
        ', found ' + matches.length + '.'
      );
      return;
    }

    ['SourceFile', 'SourcePage', 'ExtractionNotes'].forEach(function (header) {
      if (
        normalizeImportCell_(matches[0][header]) !==
        normalizeImportCell_(sourceRow[header])
      ) {
        errors.push(
          sourceRow.BOW_ID +
          ' audit field does not match staging: ' + header + '.'
        );
      }
    });
  });

  var auditRowCount = Object.keys(auditMatches).reduce(function (count, key) {
    return count + auditMatches[key].length;
  }, 0);
  if (auditRowCount !== sourceRows.length) {
    errors.push(
      'Audit batch ' + importBatch +
      ' contains ' + auditRowCount +
      ' row(s), expected ' + sourceRows.length + '.'
    );
  }
}

function createScienceCommitValidationReport_(errors, importedRows) {
  var valid = errors.length === 0;
  var lines = [
    valid
      ? 'Science BOW post-import validation passed.'
      : 'Science BOW post-import validation failed.',
    'Imported Science review rows: ' + importedRows,
    'SUPPORT_MATRIX activation changes: 0',
    'SUBJECT_PROFILES changes: 0',
    'Validation errors: ' + errors.length
  ];
  if (errors.length) {
    lines.push('', errors.slice(0, 20).join('\n'));
  }
  return {
    valid: valid,
    errors: errors,
    text: lines.join('\n')
  };
}

function createScienceBowImportReport_(errors, sourceRows, sourceRowCount) {
  var valid = errors.length === 0;
  var gradeSummary = Object.keys(BOW_SCIENCE_IMPORT_EXPECTED_GRADE_COUNTS_)
    .map(function (grade) {
      return grade + ': ' + BOW_SCIENCE_IMPORT_EXPECTED_GRADE_COUNTS_[grade] + ' row(s)';
    });
  var termSummary = Object.keys(BOW_SCIENCE_IMPORT_EXPECTED_TERM_COUNTS_)
    .map(function (term) {
      return term + ': ' + BOW_SCIENCE_IMPORT_EXPECTED_TERM_COUNTS_[term] + ' row(s)';
    });
  var populatedNotes = sourceRows.filter(function (row) {
    return String(row.ExtractionNotes || '').trim();
  }).length;
  var lines = [
    valid
      ? 'Science BOW import dry run passed.'
      : 'Science BOW import dry run failed.',
    'Source rows: ' + sourceRowCount +
      ' / ' + BOW_SCIENCE_IMPORT_EXPECTED_SOURCE_ROWS_,
    'Expected grade/term tuples: ' +
      BOW_SCIENCE_IMPORT_EXPECTED_TUPLES_.length,
    'ExtractionNotes populated: ' + populatedNotes +
      ' / ' + sourceRowCount,
    'Science review rows eligible to append: ' +
      (valid ? sourceRows.length : 0),
    'Validation errors: ' + errors.length
  ];

  if (errors.length) {
    lines.push('', errors.slice(0, 20).join('\n'));
    if (errors.length > 20) {
      lines.push('Additional errors omitted: ' + (errors.length - 20) + '.');
    }
  }

  return {
    valid: valid,
    errors: errors,
    sourceRows: sourceRowCount,
    sourceData: sourceRows,
    gradeSummary: gradeSummary,
    termSummary: termSummary,
    text: lines.join('\n')
  };
}

function scienceImportTupleKey_(gradeLevel, term) {
  return [
    normalizeForMatch_(gradeLevel),
    normalizeForMatch_(normalizeTerm_(term))
  ].join('|');
}

function prepareFilipinoBowImportStaging() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(BOW_FILIPINO_IMPORT_STAGING_SHEET_);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(BOW_FILIPINO_IMPORT_STAGING_SHEET_);
    sheet.getRange(1, 1, 1, BOW_MATH_IMPORT_HEADERS_.length)
      .setValues([BOW_MATH_IMPORT_HEADERS_]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() > 1) {
    throw new Error(
      BOW_FILIPINO_IMPORT_STAGING_SHEET_ +
      ' already contains data. It was not cleared or overwritten.'
    );
  } else {
    assertExactSheetHeaders_(
      sheet,
      BOW_MATH_IMPORT_HEADERS_,
      BOW_FILIPINO_IMPORT_STAGING_SHEET_
    );
  }

  SpreadsheetApp.getUi().alert(
    BOW_FILIPINO_IMPORT_STAGING_SHEET_ +
    ' is ready. Import the reviewed Filipino CSV without changing its headers, then run dryRunFilipinoBowImport.'
  );
}

function dryRunFilipinoBowImport() {
  var report = buildFilipinoBowImportDryRun_();
  Logger.log(report.text);
  SpreadsheetApp.getUi().alert(report.text);
  return report;
}

function commitFilipinoBowImport() {
  var initialReport = buildFilipinoBowImportDryRun_();
  if (!initialReport.valid) {
    throw new Error('Filipino BOW import dry run failed:\n' + initialReport.errors.join('\n'));
  }

  var ui = SpreadsheetApp.getUi();
  var confirmation = ui.alert(
    'Commit Filipino BOW review import?',
    initialReport.text +
    '\n\nThis will append exactly 372 review rows across inactive Filipino tuples. It will not activate SUPPORT_MATRIX.',
    ui.ButtonSet.YES_NO
  );
  if (confirmation !== ui.Button.YES) {
    return { committed: false, reason: 'Cancelled by user.' };
  }

  var result = withScriptLock_(function () {
    var report = buildFilipinoBowImportDryRun_();
    if (!report.valid) {
      throw new Error(
        'Filipino BOW import dry run failed after acquiring the script lock:\n' +
        report.errors.join('\n')
      );
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var bowSheet = requireExistingSheet_(spreadsheet, SHEET_NAMES.BOW_DATABASE);
    var auditSheet = requireExistingSheet_(spreadsheet, BOW_MATH_IMPORT_AUDIT_SHEET_);
    assertExactSheetHeaders_(
      auditSheet,
      BOW_MATH_IMPORT_AUDIT_HEADERS_,
      BOW_MATH_IMPORT_AUDIT_SHEET_
    );

    var timestamp = Utilities.formatDate(
      now_(),
      Session.getScriptTimeZone(),
      'yyyyMMdd_HHmmss'
    );
    var importBatch = 'FILIPINO_REVIEW_' + timestamp;
    var bowBackup = createImportBackupSheet_(
      spreadsheet,
      bowSheet,
      'BOW_DATABASE_BACKUP_FILIPINO_' + timestamp
    );
    var auditBackup = createImportBackupSheet_(
      spreadsheet,
      auditSheet,
      'BOW_AUDIT_BACKUP_FILIPINO_' + timestamp
    );
    var beforeState = captureEnglishBowImportState_(
      spreadsheet,
      bowSheet,
      auditSheet
    );

    try {
      appendFilipinoBowImportRows_(bowSheet, report.sourceData);
      appendFilipinoBowAuditRows_(auditSheet, report.sourceData, importBatch);
      SpreadsheetApp.flush();

      var validation = validateCommittedFilipinoBowImport_({
        spreadsheet: spreadsheet,
        bowSheet: bowSheet,
        auditSheet: auditSheet,
        sourceRows: report.sourceData,
        importBatch: importBatch,
        beforeState: beforeState
      });
      if (!validation.valid) {
        throw new Error(
          'Post-import validation failed:\n' + validation.errors.join('\n')
        );
      }

      return {
        committed: true,
        importBatch: importBatch,
        importedRows: report.sourceData.length,
        bowBackupSheet: bowBackup.getName(),
        auditBackupSheet: auditBackup.getName(),
        validationText: validation.text
      };
    } catch (err) {
      restoreSheetFromImportBackup_(bowSheet, bowBackup);
      restoreSheetFromImportBackup_(auditSheet, auditBackup);
      SpreadsheetApp.flush();
      throw new Error(
        'Filipino BOW import was rolled back. Backup sheets and staging data were retained. ' +
        (err && err.message ? err.message : String(err))
      );
    }
  }, 30000);

  ui.alert(
    'Filipino BOW review import completed.\n\n' +
    'Batch: ' + result.importBatch + '\n' +
    'Imported rows: ' + result.importedRows + '\n' +
    'BOW backup: ' + result.bowBackupSheet + '\n' +
    'Audit backup: ' + result.auditBackupSheet + '\n\n' +
    result.validationText
  );
  return result;
}

function buildFilipinoBowImportDryRun_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var errors = [];
  var stagingSheet = spreadsheet.getSheetByName(
    BOW_FILIPINO_IMPORT_STAGING_SHEET_
  );

  if (!stagingSheet) {
    return createFilipinoBowImportReport_(
      [
        'Missing staging sheet: ' + BOW_FILIPINO_IMPORT_STAGING_SHEET_ +
        '. Run prepareFilipinoBowImportStaging and import the reviewed CSV first.'
      ],
      [],
      0
    );
  }

  try {
    assertExactSheetHeaders_(
      stagingSheet,
      BOW_MATH_IMPORT_HEADERS_,
      BOW_FILIPINO_IMPORT_STAGING_SHEET_
    );
  } catch (err) {
    errors.push(err.message);
  }

  var sourceRows = readFilipinoBowStagingRows_(stagingSheet);
  if (sourceRows.length !== BOW_FILIPINO_IMPORT_EXPECTED_SOURCE_ROWS_) {
    errors.push(
      'Expected exactly ' + BOW_FILIPINO_IMPORT_EXPECTED_SOURCE_ROWS_ +
      ' source rows, found ' + sourceRows.length + '.'
    );
  }

  validateFilipinoBowSourceRows_(sourceRows, errors);
  validateFilipinoRowsAgainstLiveData_(spreadsheet, sourceRows, errors);
  validateFilipinoTuplesInactive_(sourceRows, errors);

  return createFilipinoBowImportReport_(
    errors,
    sourceRows,
    sourceRows.length
  );
}

function readFilipinoBowStagingRows_(sheet) {
  if (sheet.getLastRow() < 2) {
    return [];
  }

  var values = sheet.getRange(
    2,
    1,
    sheet.getLastRow() - 1,
    BOW_MATH_IMPORT_HEADERS_.length
  ).getValues();
  return values.map(function (row) {
    var object = {};
    BOW_MATH_IMPORT_HEADERS_.forEach(function (header, index) {
      object[header] = row[index];
    });
    return object;
  });
}

function validateFilipinoBowSourceRows_(rows, errors) {
  var requiredFields = BOW_MATH_IMPORT_HEADERS_;
  var seenIds = {};

  rows.forEach(function (row, index) {
    var rowLabel = 'Staging row ' + (index + 2);
    requiredFields.forEach(function (fieldName) {
      if (!String(row[fieldName] || '').trim()) {
        errors.push(rowLabel + ' is missing ' + fieldName + '.');
      }
    });

    var bowId = String(row.BOW_ID || '').trim();
    var bowIdKey = normalizeForMatch_(bowId);
    if (bowIdKey) {
      if (seenIds[bowIdKey]) {
        errors.push('Duplicate source BOW_ID: ' + bowId + '.');
      }
      seenIds[bowIdKey] = true;
    }

    validateFilipinoBowIdentity_(row, rowLabel, errors);
    validateFilipinoConstructedPacingNote_(row, rowLabel, errors);
  });
}

function validateFilipinoBowIdentity_(row, rowLabel, errors) {
  if (String(row.Subject || '').trim() !== 'Filipino') {
    errors.push(rowLabel + ' must use Subject "Filipino".');
  }

  var gradeMatch = String(row.GradeLevel || '').trim().match(/^Grade (10|11|[2-9])$/);
  if (!gradeMatch) {
    errors.push(rowLabel + ' has invalid GradeLevel: ' + row.GradeLevel + '.');
  }

  var term = String(row.Term || '').trim();
  if (['First Term', 'Second Term', 'Third Term'].indexOf(term) === -1) {
    errors.push(rowLabel + ' has invalid Term: ' + row.Term + '.');
  }

  var weekText = String(row.WeekNumber || '').trim();
  if (!/^\d+$/.test(weekText) || Number(weekText) < 1 || Number(weekText) > 10) {
    errors.push(rowLabel + ' has invalid WeekNumber: ' + row.WeekNumber + '.');
  }
}

function validateFilipinoConstructedPacingNote_(row, rowLabel, errors) {
  if (
    String(row.ExtractionNotes || '').indexOf(
      BOW_FILIPINO_IMPORT_CONSTRUCTED_PACING_NOTE_
    ) === -1
  ) {
    errors.push(
      rowLabel +
      ' ExtractionNotes must contain: ' +
      BOW_FILIPINO_IMPORT_CONSTRUCTED_PACING_NOTE_
    );
  }
}

function validateFilipinoRowsAgainstLiveData_(spreadsheet, sourceRows, errors) {
  var bowSheet = spreadsheet.getSheetByName(SHEET_NAMES.BOW_DATABASE);
  if (!bowSheet) {
    errors.push('Missing live sheet: ' + SHEET_NAMES.BOW_DATABASE + '.');
    return;
  }

  try {
    assertRequiredHeaders_(bowSheet, BOW_HEADERS, SHEET_NAMES.BOW_DATABASE);
  } catch (err) {
    errors.push(err.message);
    return;
  }

  var auditSheet = spreadsheet.getSheetByName(BOW_MATH_IMPORT_AUDIT_SHEET_);
  if (!auditSheet) {
    errors.push('Missing required audit sheet: ' + BOW_MATH_IMPORT_AUDIT_SHEET_ + '.');
    return;
  }
  try {
    assertExactSheetHeaders_(
      auditSheet,
      BOW_MATH_IMPORT_AUDIT_HEADERS_,
      BOW_MATH_IMPORT_AUDIT_SHEET_
    );
  } catch (err) {
    errors.push(err.message);
    return;
  }

  var existingBowIds = {};
  getSheetObjects_(bowSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      existingBowIds[key] = true;
    }
  });

  var auditedIds = {};
  getSheetObjects_(auditSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      auditedIds[key] = true;
    }
  });

  sourceRows.forEach(function (row) {
    var bowId = String(row.BOW_ID || '').trim();
    var key = normalizeForMatch_(bowId);
    if (existingBowIds[key]) {
      errors.push('Incoming Filipino BOW_ID already exists in BOW_DATABASE: ' + bowId + '.');
    }
    if (auditedIds[key]) {
      errors.push('Incoming Filipino BOW_ID already exists in BOW_DATABASE_AUDIT: ' + bowId + '.');
    }
  });
}

function validateFilipinoTuplesInactive_(rows, errors) {
  var checked = {};

  rows.forEach(function (row) {
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    if (checked[key]) {
      return;
    }
    checked[key] = true;

    var support = getSupportStatus_(row);
    if (support.supported) {
      errors.push(
        'Filipino review tuple is already processable and must remain inactive: ' +
        row.GradeLevel + ' / ' + row.Subject + ' / ' + row.Term + '.'
      );
    }
  });
}

function appendFilipinoBowImportRows_(bowSheet, sourceRows) {
  var headerMap = getHeaderMap_(bowSheet);
  var lastColumn = bowSheet.getLastColumn();
  var values = sourceRows.map(function (sourceRow) {
    var row = new Array(lastColumn).fill('');
    BOW_HEADERS.forEach(function (header) {
      var value = header === 'Notes'
        ? sourceRow.ExtractionNotes
        : sourceRow[header];
      row[headerMap[header] - 1] = header === 'WeekNumber'
        ? normalizeFilipinoComparableText_(value)
        : value;
    });
    return row;
  });

  if (values.length) {
    bowSheet.getRange(
      bowSheet.getLastRow() + 1,
      1,
      values.length,
      lastColumn
    ).setValues(values);
  }
}

function appendFilipinoBowAuditRows_(auditSheet, sourceRows, importBatch) {
  var importedAt = now_();
  var values = sourceRows.map(function (row) {
    return [
      row.BOW_ID,
      row.SourceFile,
      normalizeFilipinoComparableText_(row.SourcePage),
      row.ExtractionNotes,
      importBatch,
      importedAt
    ];
  });

  if (values.length) {
    auditSheet.getRange(
      auditSheet.getLastRow() + 1,
      1,
      values.length,
      values[0].length
    ).setValues(values);
  }
}

function normalizeFilipinoComparableText_(value) {
  if (value === null || typeof value === 'undefined') {
    return '';
  }
  return String(value).replace(/\s+/g, ' ').trim();
}

function normalizeFilipinoCommittedField_(fieldName, value) {
  if (fieldName === 'WeekNumber' || fieldName === 'SourcePage') {
    return normalizeFilipinoComparableText_(value);
  }
  return normalizeImportCell_(value);
}

function validateCommittedFilipinoBowImport_(context) {
  var errors = [];
  var sourceRows = context.sourceRows;
  var before = context.beforeState;
  var bowRowCountAfter = Math.max(context.bowSheet.getLastRow() - 1, 0);
  var auditRowCountAfter = Math.max(context.auditSheet.getLastRow() - 1, 0);

  if (bowRowCountAfter - before.bowRowCount !== sourceRows.length) {
    errors.push(
      'BOW_DATABASE row count changed by ' +
      (bowRowCountAfter - before.bowRowCount) +
      ', expected ' + sourceRows.length + '.'
    );
  }
  if (auditRowCountAfter - before.auditRowCount !== sourceRows.length) {
    errors.push(
      'BOW_DATABASE_AUDIT row count changed by ' +
      (auditRowCountAfter - before.auditRowCount) +
      ', expected ' + sourceRows.length + '.'
    );
  }

  var existingBowChecksumAfter = checksumValues_(
    context.bowSheet.getRange(
      1,
      1,
      before.bowRegionRows,
      before.bowRegionColumns
    ).getValues()
  );
  if (existingBowChecksumAfter !== before.bowChecksum) {
    errors.push('Pre-existing BOW_DATABASE rows changed during Filipino import.');
  }

  var existingAuditChecksumAfter = checksumValues_(
    context.auditSheet.getRange(
      1,
      1,
      before.auditRegionRows,
      before.auditRegionColumns
    ).getValues()
  );
  if (existingAuditChecksumAfter !== before.auditChecksum) {
    errors.push('Pre-existing BOW_DATABASE_AUDIT rows changed during Filipino import.');
  }

  validateFilipinoCommittedBowRows_(context.bowSheet, sourceRows, errors);
  validateFilipinoCommittedAuditRows_(
    context.auditSheet,
    sourceRows,
    context.importBatch,
    errors
  );

  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUPPORT_MATRIX)
    ) !== before.supportChecksum
  ) {
    errors.push('SUPPORT_MATRIX changed during Filipino import.');
  }
  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUBJECT_PROFILES)
    ) !== before.profileChecksum
  ) {
    errors.push('SUBJECT_PROFILES changed during Filipino import.');
  }

  validateFilipinoTuplesInactive_(sourceRows, errors);
  return createFilipinoCommitValidationReport_(errors, sourceRows.length);
}

function validateFilipinoCommittedBowRows_(bowSheet, sourceRows, errors) {
  var liveById = {};
  getSheetObjects_(bowSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      liveById[key] = liveById[key] || [];
      liveById[key].push(row);
    }
  });

  sourceRows.forEach(function (sourceRow) {
    var matches = liveById[normalizeForMatch_(sourceRow.BOW_ID)] || [];
    if (matches.length !== 1) {
      errors.push(
        'Expected exactly one imported BOW_DATABASE row for ' +
        sourceRow.BOW_ID + ', found ' + matches.length + '.'
      );
      return;
    }

    var liveRow = matches[0];
    BOW_HEADERS.forEach(function (header) {
      var expected = header === 'Notes'
        ? sourceRow.ExtractionNotes
        : sourceRow[header];
      if (
        normalizeFilipinoCommittedField_(header, liveRow[header]) !==
        normalizeFilipinoCommittedField_(header, expected)
      ) {
        errors.push(
          sourceRow.BOW_ID +
          ' does not match staging field ' + header + '.'
        );
      }
    });
  });
}

function validateFilipinoCommittedAuditRows_(
  auditSheet,
  sourceRows,
  importBatch,
  errors
) {
  var auditMatches = {};
  getSheetObjects_(auditSheet).forEach(function (row) {
    if (String(row.ImportBatch || '') !== importBatch) {
      return;
    }
    var key = normalizeForMatch_(row.BOW_ID);
    auditMatches[key] = auditMatches[key] || [];
    auditMatches[key].push(row);
  });

  sourceRows.forEach(function (sourceRow) {
    var matches = auditMatches[normalizeForMatch_(sourceRow.BOW_ID)] || [];
    if (matches.length !== 1) {
      errors.push(
        'Expected exactly one audit row for ' +
        sourceRow.BOW_ID + ' in batch ' + importBatch +
        ', found ' + matches.length + '.'
      );
      return;
    }

    ['SourceFile', 'SourcePage', 'ExtractionNotes'].forEach(function (header) {
      if (
        normalizeFilipinoCommittedField_(header, matches[0][header]) !==
        normalizeFilipinoCommittedField_(header, sourceRow[header])
      ) {
        errors.push(
          sourceRow.BOW_ID +
          ' audit field does not match staging: ' + header + '.'
        );
      }
    });
  });

  var auditRowCount = Object.keys(auditMatches).reduce(function (count, key) {
    return count + auditMatches[key].length;
  }, 0);
  if (auditRowCount !== sourceRows.length) {
    errors.push(
      'Audit batch ' + importBatch +
      ' contains ' + auditRowCount +
      ' row(s), expected ' + sourceRows.length + '.'
    );
  }
}

function createFilipinoCommitValidationReport_(errors, importedRows) {
  var valid = errors.length === 0;
  var lines = [
    valid
      ? 'Filipino BOW post-import validation passed.'
      : 'Filipino BOW post-import validation failed.',
    'Imported Filipino review rows: ' + importedRows,
    'SUPPORT_MATRIX activation changes: 0',
    'SUBJECT_PROFILES changes: 0',
    'Validation errors: ' + errors.length
  ];
  if (errors.length) {
    lines.push('', errors.slice(0, 20).join('\n'));
  }
  return {
    valid: valid,
    errors: errors,
    text: lines.join('\n')
  };
}

function createFilipinoBowImportReport_(errors, sourceRows, sourceRowCount) {
  var valid = errors.length === 0;
  var tupleCount = countFilipinoImportTuples_(sourceRows);
  var noteCount = sourceRows.filter(function (row) {
    return String(row.ExtractionNotes || '').indexOf(
      BOW_FILIPINO_IMPORT_CONSTRUCTED_PACING_NOTE_
    ) !== -1;
  }).length;
  var lines = [
    valid
      ? 'Filipino BOW import dry run passed.'
      : 'Filipino BOW import dry run failed.',
    'Source rows: ' + sourceRowCount +
      ' / ' + BOW_FILIPINO_IMPORT_EXPECTED_SOURCE_ROWS_,
    'Detected Filipino grade/term tuples: ' + tupleCount,
    'Constructed-pacing notes present: ' + noteCount +
      ' / ' + sourceRowCount,
    'Filipino review rows eligible to append: ' +
      (valid ? sourceRows.length : 0),
    'Validation errors: ' + errors.length
  ];

  if (errors.length) {
    lines.push('', errors.slice(0, 20).join('\n'));
    if (errors.length > 20) {
      lines.push('Additional errors omitted: ' + (errors.length - 20) + '.');
    }
  }

  return {
    valid: valid,
    errors: errors,
    sourceRows: sourceRowCount,
    sourceData: sourceRows,
    text: lines.join('\n')
  };
}

function countFilipinoImportTuples_(rows) {
  var tuples = {};
  (rows || []).forEach(function (row) {
    tuples[supportMatrixKey_(row.GradeLevel, row.Subject, row.Term)] = true;
  });
  return Object.keys(tuples).length;
}

function prepareAralingPanlipunanBowImportStaging() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(BOW_AP_IMPORT_STAGING_SHEET_);
  var sourcePageColumn = BOW_MATH_IMPORT_HEADERS_.indexOf('SourcePage') + 1;

  if (!sheet) {
    sheet = spreadsheet.insertSheet(BOW_AP_IMPORT_STAGING_SHEET_);
    sheet.getRange(1, 1, 1, BOW_MATH_IMPORT_HEADERS_.length)
      .setValues([BOW_MATH_IMPORT_HEADERS_]);
    sheet.setFrozenRows(1);
    sheet.getRange(2, sourcePageColumn, sheet.getMaxRows() - 1, 1)
      .setNumberFormat('@');
  } else if (sheet.getLastRow() > 1) {
    throw new Error(
      BOW_AP_IMPORT_STAGING_SHEET_ +
      ' already contains data. It was not cleared or overwritten.'
    );
  } else {
    assertExactSheetHeaders_(
      sheet,
      BOW_MATH_IMPORT_HEADERS_,
      BOW_AP_IMPORT_STAGING_SHEET_
    );
    sheet.getRange(2, sourcePageColumn, sheet.getMaxRows() - 1, 1)
      .setNumberFormat('@');
  }

  SpreadsheetApp.getUi().alert([
    BOW_AP_IMPORT_STAGING_SHEET_ +
      ' is ready. The SourcePage column is formatted as plain text.',
    '',
    'PASTE the audited 226-row CSV directly into this sheet. Do NOT use File > Import.',
    '',
    'If File > Import must be used, UNCHECK "Convert text to numbers, dates, and formulas" - that option is ON by default and overrides the plain-text formatting.',
    '',
    'Three rows have hyphen-range SourcePage values that Sheets will silently turn into dates if converted:',
    'BOW-G6-AP-T2-W8-9-A - SourcePage 3-4',
    'BOW-G6-AP-T2-W8-9-B - SourcePage 3-4',
    'BOW-G7-AP-T2-W8-9 - SourcePage 4-5',
    '',
    'After pasting, verify those three rows still read as text, then run dryRunAralingPanlipunanBowImport.'
  ].join('\n'));
}

function dryRunAralingPanlipunanBowImport() {
  var report = buildAralingPanlipunanBowImportDryRun_();
  Logger.log(report.text);
  SpreadsheetApp.getUi().alert(report.text);
  return report;
}

function commitAralingPanlipunanBowImport() {
  var initialReport = buildAralingPanlipunanBowImportDryRun_();
  assertAralingPanlipunanCommitReadiness_(initialReport);

  var ui = SpreadsheetApp.getUi();
  var confirmation = ui.alert(
    'Commit Araling Panlipunan BOW review import?',
    initialReport.text +
    '\n\nThis will append exactly 226 review-only rows across 33 official grade-term tuples.' +
    '\nSubjects: Makabansa, Araling Panlipunan, and Pag-aaral ng Kasaysayan at Lipunang Pilipino.' +
    '\nIt will not activate SUPPORT_MATRIX.',
    ui.ButtonSet.YES_NO
  );
  if (confirmation !== ui.Button.YES) {
    return { committed: false, reason: 'Cancelled by user.' };
  }

  var result = withScriptLock_(function () {
    var report = buildAralingPanlipunanBowImportDryRun_();
    assertAralingPanlipunanCommitReadiness_(report);

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var bowSheet = requireExistingSheet_(spreadsheet, SHEET_NAMES.BOW_DATABASE);
    var auditSheet = requireExistingSheet_(spreadsheet, BOW_MATH_IMPORT_AUDIT_SHEET_);
    assertExactSheetHeaders_(
      auditSheet,
      BOW_MATH_IMPORT_AUDIT_HEADERS_,
      BOW_MATH_IMPORT_AUDIT_SHEET_
    );

    var timestamp = Utilities.formatDate(
      now_(),
      Session.getScriptTimeZone(),
      'yyyyMMdd_HHmmss'
    );
    var importBatch = 'ARALING_PANLIPUNAN_REVIEW_' + timestamp;
    var bowBackup = createImportBackupSheet_(
      spreadsheet,
      bowSheet,
      'BOW_DATABASE_BACKUP_ARALING_PANLIPUNAN_' + timestamp
    );
    var auditBackup = createImportBackupSheet_(
      spreadsheet,
      auditSheet,
      'BOW_AUDIT_BACKUP_ARALING_PANLIPUNAN_' + timestamp
    );
    var beforeState = captureEnglishBowImportState_(
      spreadsheet,
      bowSheet,
      auditSheet
    );

    try {
      appendAralingPanlipunanBowImportRows_(bowSheet, report.sourceData);
      appendAralingPanlipunanBowAuditRows_(
        auditSheet,
        report.sourceData,
        importBatch
      );
      SpreadsheetApp.flush();

      var validation = validateCommittedAralingPanlipunanBowImport_({
        spreadsheet: spreadsheet,
        bowSheet: bowSheet,
        auditSheet: auditSheet,
        sourceRows: report.sourceData,
        importBatch: importBatch,
        beforeState: beforeState
      });
      if (!validation.valid) {
        throw new Error(
          'Post-import validation failed:\n' + validation.errors.join('\n')
        );
      }

      return {
        committed: true,
        importBatch: importBatch,
        importedRows: report.sourceData.length,
        bowBackupSheet: bowBackup.getName(),
        auditBackupSheet: auditBackup.getName(),
        validationText: validation.text
      };
    } catch (err) {
      var originalMessage = err && err.message ? err.message : String(err);
      var rollback = rollbackAralingPanlipunanBowImport_({
        bowSheet: bowSheet,
        bowBackup: bowBackup,
        auditSheet: auditSheet,
        auditBackup: auditBackup,
        beforeState: beforeState
      });
      throw new Error(
        'Araling Panlipunan BOW import failed: ' + originalMessage +
        '\nRollback result: ' + rollback.text
      );
    }
  }, 30000);

  ui.alert(
    'Araling Panlipunan BOW review import completed.\n\n' +
    'Batch: ' + result.importBatch + '\n' +
    'Imported rows: ' + result.importedRows + '\n' +
    'BOW backup: ' + result.bowBackupSheet + '\n' +
    'Audit backup: ' + result.auditBackupSheet + '\n\n' +
    result.validationText
  );
  return result;
}

function buildAralingPanlipunanBowImportDryRun_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var errors = [];
  var stagingSheet = spreadsheet.getSheetByName(BOW_AP_IMPORT_STAGING_SHEET_);

  if (!stagingSheet) {
    return createAralingPanlipunanBowImportReport_(
      [
        'Missing staging sheet: ' + BOW_AP_IMPORT_STAGING_SHEET_ +
        '. Run prepareAralingPanlipunanBowImportStaging and paste the reviewed CSV first.'
      ],
      [],
      0
    );
  }

  try {
    assertExactSheetHeaders_(
      stagingSheet,
      BOW_MATH_IMPORT_HEADERS_,
      BOW_AP_IMPORT_STAGING_SHEET_
    );
  } catch (err) {
    errors.push(err.message);
  }

  var sourceRows = readAralingPanlipunanBowStagingRows_(stagingSheet);
  if (sourceRows.length !== BOW_AP_IMPORT_EXPECTED_SOURCE_ROWS_) {
    errors.push(
      'Expected exactly ' + BOW_AP_IMPORT_EXPECTED_SOURCE_ROWS_ +
      ' source rows, found ' + sourceRows.length + '.'
    );
  }

  validateAralingPanlipunanBowSourceRows_(sourceRows, errors);
  validateAralingPanlipunanExpectedCounts_(sourceRows, errors);
  validateAralingPanlipunanRowsAgainstLiveData_(spreadsheet, sourceRows, errors);
  validateAralingPanlipunanTuplesInactive_(sourceRows, errors);

  return createAralingPanlipunanBowImportReport_(
    errors,
    sourceRows,
    sourceRows.length
  );
}

function readAralingPanlipunanBowStagingRows_(sheet) {
  if (sheet.getLastRow() < 2) {
    return [];
  }

  var values = sheet.getRange(
    2,
    1,
    sheet.getLastRow() - 1,
    BOW_MATH_IMPORT_HEADERS_.length
  ).getValues();
  return values.map(function (row) {
    var object = {};
    BOW_MATH_IMPORT_HEADERS_.forEach(function (header, index) {
      object[header] = row[index];
    });
    return object;
  });
}

function validateAralingPanlipunanBowSourceRows_(rows, errors) {
  var requiredFields = BOW_MATH_IMPORT_HEADERS_;
  var seenIds = {};

  rows.forEach(function (row, index) {
    var rowLabel = 'Staging row ' + (index + 2);

    if (row.SourcePage instanceof Date) {
      errors.push(
        rowLabel +
        ' SourcePage was converted to a date by Sheets. Re-enter it as plain text before importing.'
      );
    }
    if (row.WeekNumber instanceof Date) {
      errors.push(
        rowLabel +
        ' WeekNumber was converted to a date by Sheets. Re-enter it as plain text before importing.'
      );
    }

    requiredFields.forEach(function (fieldName) {
      if (!String(row[fieldName] || '').trim()) {
        errors.push(rowLabel + ' is missing ' + fieldName + '.');
      }
    });

    var bowId = String(row.BOW_ID || '').trim();
    var bowIdKey = normalizeForMatch_(bowId);
    if (bowIdKey) {
      if (seenIds[bowIdKey]) {
        errors.push('Duplicate source BOW_ID: ' + bowId + '.');
      }
      seenIds[bowIdKey] = true;
    }

    validateAralingPanlipunanBowIdentity_(row, rowLabel, errors);

    if (
      String(row.ExtractionNotes || '')
        .toLowerCase()
        .indexOf('abakada-constructed') !== -1
    ) {
      errors.push(
        rowLabel +
        ' ExtractionNotes must not contain constructed pacing. Araling Panlipunan rows use official DepEd pacing only.'
      );
    }
  });
}

function validateAralingPanlipunanBowIdentity_(row, rowLabel, errors) {
  var gradeMatch = String(row.GradeLevel || '').trim().match(/^Grade (11|10|[1-9])$/);
  if (!gradeMatch) {
    errors.push(rowLabel + ' has invalid GradeLevel: ' + row.GradeLevel + '.');
    return;
  }

  var grade = Number(gradeMatch[1]);
  var subjectEntry = BOW_AP_SUBJECT_BY_GRADE_[grade];
  if (!subjectEntry) {
    errors.push(
      rowLabel + ' has no Araling Panlipunan subject mapping for GradeLevel: ' +
      row.GradeLevel + '.'
    );
    return;
  }

  if (String(row.Subject || '').trim() !== subjectEntry.name) {
    errors.push(
      rowLabel + ' must use Subject "' + subjectEntry.name + '" for ' +
      row.GradeLevel + '.'
    );
  }

  var termNumbers = {
    'First Term': 1,
    'Second Term': 2,
    'Third Term': 3
  };
  var term = String(row.Term || '').trim();
  var termNumber = termNumbers[term];
  if (!termNumber) {
    errors.push(rowLabel + ' has invalid Term: ' + row.Term + '.');
    return;
  }

  var week = parseAralingPanlipunanWeek_(row.WeekNumber);
  if (!week.valid) {
    errors.push(
      rowLabel + ' has invalid WeekNumber: ' + row.WeekNumber + '. ' +
      week.reason
    );
    return;
  }

  var weekId = week.end > week.start
    ? 'W' + week.start + '-' + week.end
    : 'W' + week.start;
  var expectedId =
    'BOW-G' + grade + '-' + subjectEntry.code + '-T' + termNumber + '-' + weekId;
  var bowId = String(row.BOW_ID || '').trim();
  var idPattern = new RegExp('^' + escapeRegExp_(expectedId) + '(?:-[A-Z])?$');
  if (!idPattern.test(bowId)) {
    errors.push(
      rowLabel + ' must use BOW_ID ' + expectedId +
      ' (optionally with a single -A style capital-letter suffix), found ' +
      row.BOW_ID + '.'
    );
  }
}

function parseAralingPanlipunanWeek_(value) {
  var text = String(
    value === null || typeof value === 'undefined' ? '' : value
  ).trim();
  var match = text.match(/^(\d+)(?: to (\d+))?$/);

  if (!match) {
    return {
      valid: false,
      reason: 'WeekNumber must be a single week ("3") or a range ("1 to 6").'
    };
  }

  var start = Number(match[1]);
  var end = match[2] ? Number(match[2]) : start;
  if (start < 1 || end < 1 || start > 10 || end > 10) {
    return { valid: false, reason: 'Week values must be within 1-10.' };
  }
  if (end < start) {
    return { valid: false, reason: 'Week range ends before it starts.' };
  }

  return {
    valid: true,
    start: start,
    end: end,
    isRange: end > start,
    text: text
  };
}

function normalizeAralingPanlipunanComparableText_(value) {
  if (value === null || typeof value === 'undefined') {
    return '';
  }
  return String(value).replace(/\s+/g, ' ').trim();
}

function aralingPanlipunanImportTupleKey_(gradeLevel, term) {
  return [
    normalizeForMatch_(gradeLevel),
    normalizeForMatch_(normalizeTerm_(term))
  ].join('|');
}

function validateAralingPanlipunanExpectedCounts_(rows, errors) {
  var expectedByKey = {};
  var actualByKey = {};
  var subjectCounts = {};
  var rangeWeekRows = 0;
  var singleWeekRows = 0;
  var coveredWeeksByKey = {};

  BOW_AP_IMPORT_EXPECTED_TUPLES_.forEach(function (expected) {
    expectedByKey[
      aralingPanlipunanImportTupleKey_(expected.GradeLevel, expected.Term)
    ] = expected;
  });

  rows.forEach(function (row) {
    var key = aralingPanlipunanImportTupleKey_(row.GradeLevel, row.Term);
    actualByKey[key] = actualByKey[key] || [];
    actualByKey[key].push(row);
    var subject = String(row.Subject || '').trim();
    if (subject) {
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
    }

    var week = parseAralingPanlipunanWeek_(row.WeekNumber);
    if (week.valid) {
      if (week.isRange) {
        rangeWeekRows += 1;
      } else {
        singleWeekRows += 1;
      }
      coveredWeeksByKey[key] = coveredWeeksByKey[key] || {};
      for (var coveredWeek = week.start; coveredWeek <= week.end; coveredWeek++) {
        coveredWeeksByKey[key][coveredWeek] = true;
      }
    }
  });

  if (
    Object.keys(actualByKey).length !== BOW_AP_IMPORT_EXPECTED_TUPLES_.length
  ) {
    errors.push(
      'Expected exactly ' + BOW_AP_IMPORT_EXPECTED_TUPLES_.length +
      ' populated Araling Panlipunan grade/term tuples, found ' +
      Object.keys(actualByKey).length + '.'
    );
  }

  Object.keys(expectedByKey).forEach(function (key) {
    var expected = expectedByKey[key];
    var actualRows = actualByKey[key] || [];
    if (actualRows.length !== expected.Count) {
      errors.push(
        expected.GradeLevel + ' / ' + expected.Term +
        ' expected ' + expected.Count + ' row(s), found ' +
        actualRows.length + '.'
      );
    }
  });

  Object.keys(actualByKey).forEach(function (key) {
    if (!expectedByKey[key]) {
      var row = actualByKey[key][0];
      errors.push(
        'Unexpected Araling Panlipunan import tuple: ' +
        row.GradeLevel + ' / ' + row.Term + '.'
      );
    }
  });

  Object.keys(BOW_AP_IMPORT_EXPECTED_SUBJECT_COUNTS_).forEach(function (subject) {
    var expectedCount = BOW_AP_IMPORT_EXPECTED_SUBJECT_COUNTS_[subject];
    var actualCount = subjectCounts[subject] || 0;
    if (actualCount !== expectedCount) {
      errors.push(
        subject + ' expected ' + expectedCount +
        ' row(s), found ' + actualCount + '.'
      );
    }
  });

  Object.keys(subjectCounts).forEach(function (subject) {
    if (!BOW_AP_IMPORT_EXPECTED_SUBJECT_COUNTS_.hasOwnProperty(subject)) {
      errors.push('Unexpected Araling Panlipunan import Subject: ' + subject + '.');
    }
  });

  if (rangeWeekRows !== BOW_AP_IMPORT_EXPECTED_RANGE_WEEK_ROWS_) {
    errors.push(
      'Expected exactly ' + BOW_AP_IMPORT_EXPECTED_RANGE_WEEK_ROWS_ +
      ' range-form WeekNumber rows, found ' + rangeWeekRows + '.'
    );
  }
  if (singleWeekRows !== BOW_AP_IMPORT_EXPECTED_SINGLE_WEEK_ROWS_) {
    errors.push(
      'Expected exactly ' + BOW_AP_IMPORT_EXPECTED_SINGLE_WEEK_ROWS_ +
      ' single-week WeekNumber rows, found ' + singleWeekRows + '.'
    );
  }

  BOW_AP_IMPORT_EXPECTED_TUPLES_.forEach(function (expected) {
    var key = aralingPanlipunanImportTupleKey_(expected.GradeLevel, expected.Term);
    var covered = coveredWeeksByKey[key] || {};
    var missingWeeks = [];
    for (var week = 1; week <= 10; week++) {
      if (!covered[week]) {
        missingWeeks.push(week);
      }
    }
    if (missingWeeks.length) {
      errors.push(
        expected.GradeLevel + ' / ' + expected.Term +
        ' WeekNumber coverage is missing week(s): ' + missingWeeks.join(', ') + '.'
      );
    }
  });
}

function validateAralingPanlipunanRowsAgainstLiveData_(spreadsheet, sourceRows, errors) {
  var bowSheet = spreadsheet.getSheetByName(SHEET_NAMES.BOW_DATABASE);
  if (!bowSheet) {
    errors.push('Missing live sheet: ' + SHEET_NAMES.BOW_DATABASE + '.');
    return;
  }

  try {
    assertRequiredHeaders_(bowSheet, BOW_HEADERS, SHEET_NAMES.BOW_DATABASE);
  } catch (err) {
    errors.push(err.message);
    return;
  }

  var auditSheet = spreadsheet.getSheetByName(BOW_MATH_IMPORT_AUDIT_SHEET_);
  if (!auditSheet) {
    errors.push('Missing required audit sheet: ' + BOW_MATH_IMPORT_AUDIT_SHEET_ + '.');
    return;
  }
  try {
    assertExactSheetHeaders_(
      auditSheet,
      BOW_MATH_IMPORT_AUDIT_HEADERS_,
      BOW_MATH_IMPORT_AUDIT_SHEET_
    );
  } catch (err) {
    errors.push(err.message);
    return;
  }

  var existingBowIds = {};
  getSheetObjects_(bowSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      existingBowIds[key] = true;
    }
  });

  var auditedIds = {};
  getSheetObjects_(auditSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      auditedIds[key] = true;
    }
  });

  sourceRows.forEach(function (row) {
    var bowId = String(row.BOW_ID || '').trim();
    var key = normalizeForMatch_(bowId);
    if (existingBowIds[key]) {
      errors.push(
        'Incoming Araling Panlipunan BOW_ID already exists in BOW_DATABASE: ' +
        bowId + '.'
      );
    }
    if (auditedIds[key]) {
      errors.push(
        'Incoming Araling Panlipunan BOW_ID already exists in BOW_DATABASE_AUDIT: ' +
        bowId + '.'
      );
    }
  });
}

function validateAralingPanlipunanTuplesInactive_(rows, errors) {
  var checked = {};

  rows.forEach(function (row) {
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    if (checked[key]) {
      return;
    }
    checked[key] = true;

    var support = getSupportStatus_(row);
    if (support.supported) {
      errors.push(
        'Araling Panlipunan review tuple is already processable and must remain inactive: ' +
        row.GradeLevel + ' / ' + row.Subject + ' / ' + row.Term + '.'
      );
    }
  });
}

function createAralingPanlipunanBowImportReport_(errors, sourceRows, sourceRowCount) {
  var valid = errors.length === 0;
  var tuples = {};
  var subjectCounts = {};
  var rangeWeekRows = 0;
  var singleWeekRows = 0;

  (sourceRows || []).forEach(function (row) {
    tuples[aralingPanlipunanImportTupleKey_(row.GradeLevel, row.Term)] = true;
    var subject = String(row.Subject || '').trim();
    if (subject) {
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
    }
    var week = parseAralingPanlipunanWeek_(row.WeekNumber);
    if (week.valid) {
      if (week.isRange) {
        rangeWeekRows += 1;
      } else {
        singleWeekRows += 1;
      }
    }
  });

  var subjectLine = Object.keys(BOW_AP_IMPORT_EXPECTED_SUBJECT_COUNTS_)
    .map(function (subject) {
      return subject + ' ' + (subjectCounts[subject] || 0) +
        ' / ' + BOW_AP_IMPORT_EXPECTED_SUBJECT_COUNTS_[subject];
    })
    .join(', ');

  var lines = [
    valid
      ? 'Araling Panlipunan BOW import dry run passed.'
      : 'Araling Panlipunan BOW import dry run failed.',
    'Source rows: ' + sourceRowCount +
      ' / ' + BOW_AP_IMPORT_EXPECTED_SOURCE_ROWS_,
    'Detected grade/term tuples: ' + Object.keys(tuples).length +
      ' / ' + BOW_AP_IMPORT_EXPECTED_TUPLES_.length,
    'Subject rows: ' + subjectLine,
    'Range-week rows: ' + rangeWeekRows +
      ' (expected 102), single-week rows: ' + singleWeekRows +
      ' (expected 124)',
    'Araling Panlipunan review rows eligible to append: ' +
      (valid ? sourceRows.length : 0),
    'Validation errors: ' + errors.length
  ];

  if (errors.length) {
    lines.push('', errors.slice(0, 20).join('\n'));
    if (errors.length > 20) {
      lines.push('Additional errors omitted: ' + (errors.length - 20) + '.');
    }
  }

  return {
    valid: valid,
    errors: errors,
    sourceRows: sourceRowCount,
    sourceData: sourceRows,
    text: lines.join('\n')
  };
}

function assertAralingPanlipunanCommitReadiness_(report) {
  if (!report || !report.valid) {
    throw new Error(
      'Araling Panlipunan BOW import dry run failed:\n' +
      ((report && report.errors) || ['No dry-run report was returned.']).join('\n')
    );
  }

  var sourceRows = report.sourceData || [];
  var errors = [];
  if (sourceRows.length !== BOW_AP_IMPORT_EXPECTED_SOURCE_ROWS_) {
    errors.push(
      'Commit requires exactly ' + BOW_AP_IMPORT_EXPECTED_SOURCE_ROWS_ +
      ' eligible rows, found ' + sourceRows.length + '.'
    );
  }
  validateAralingPanlipunanExpectedCounts_(sourceRows, errors);
  validateAralingPanlipunanLiteralSourcePages_(
    sourceRows,
    'staging data',
    errors
  );

  if (errors.length) {
    throw new Error(
      'Araling Panlipunan commit readiness validation failed:\n' +
      errors.join('\n')
    );
  }
}

function appendAralingPanlipunanBowImportRows_(bowSheet, sourceRows) {
  var headerMap = getHeaderMap_(bowSheet);
  var lastColumn = bowSheet.getLastColumn();
  var values = sourceRows.map(function (sourceRow) {
    var row = new Array(lastColumn).fill('');
    BOW_HEADERS.forEach(function (header) {
      var value = header === 'Notes'
        ? sourceRow.ExtractionNotes
        : sourceRow[header];
      row[headerMap[header] - 1] = header === 'WeekNumber'
        ? normalizeAralingPanlipunanComparableText_(value)
        : value;
    });
    return row;
  });

  if (values.length) {
    bowSheet.getRange(
      bowSheet.getLastRow() + 1,
      1,
      values.length,
      lastColumn
    ).setValues(values);
  }
}

function appendAralingPanlipunanBowAuditRows_(auditSheet, sourceRows, importBatch) {
  var importedAt = now_();
  var values = sourceRows.map(function (row) {
    return [
      row.BOW_ID,
      row.SourceFile,
      normalizeAralingPanlipunanComparableText_(row.SourcePage),
      row.ExtractionNotes,
      importBatch,
      importedAt
    ];
  });

  if (values.length) {
    var startRow = auditSheet.getLastRow() + 1;
    auditSheet.getRange(startRow, 3, sourceRows.length, 1)
      .setNumberFormat('@');
    auditSheet.getRange(
      startRow,
      1,
      values.length,
      values[0].length
    ).setValues(values);
  }
}

function normalizeAralingPanlipunanCommittedField_(fieldName, value) {
  if (fieldName === 'WeekNumber' || fieldName === 'SourcePage') {
    return normalizeAralingPanlipunanComparableText_(value);
  }
  return normalizeImportCell_(value);
}

function validateCommittedAralingPanlipunanBowImport_(context) {
  var errors = [];
  var sourceRows = context.sourceRows;
  var before = context.beforeState;
  var bowRowCountAfter = Math.max(context.bowSheet.getLastRow() - 1, 0);
  var auditRowCountAfter = Math.max(context.auditSheet.getLastRow() - 1, 0);

  if (bowRowCountAfter - before.bowRowCount !== sourceRows.length) {
    errors.push(
      'BOW_DATABASE row count changed by ' +
      (bowRowCountAfter - before.bowRowCount) +
      ', expected ' + sourceRows.length + '.'
    );
  }
  if (auditRowCountAfter - before.auditRowCount !== sourceRows.length) {
    errors.push(
      'BOW_DATABASE_AUDIT row count changed by ' +
      (auditRowCountAfter - before.auditRowCount) +
      ', expected ' + sourceRows.length + '.'
    );
  }

  var existingBowChecksumAfter = checksumValues_(
    context.bowSheet.getRange(
      1,
      1,
      before.bowRegionRows,
      before.bowRegionColumns
    ).getValues()
  );
  if (existingBowChecksumAfter !== before.bowChecksum) {
    errors.push(
      'Pre-existing BOW_DATABASE rows changed during Araling Panlipunan import.'
    );
  }

  var existingAuditChecksumAfter = checksumValues_(
    context.auditSheet.getRange(
      1,
      1,
      before.auditRegionRows,
      before.auditRegionColumns
    ).getValues()
  );
  if (existingAuditChecksumAfter !== before.auditChecksum) {
    errors.push(
      'Pre-existing BOW_DATABASE_AUDIT rows changed during Araling Panlipunan import.'
    );
  }

  validateAralingPanlipunanCommittedBowRows_(
    context.bowSheet,
    sourceRows,
    errors
  );
  validateAralingPanlipunanCommittedAuditRows_(
    context.auditSheet,
    sourceRows,
    context.importBatch,
    errors
  );
  validateAralingPanlipunanExpectedCounts_(sourceRows, errors);

  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUPPORT_MATRIX)
    ) !== before.supportChecksum
  ) {
    errors.push('SUPPORT_MATRIX changed during Araling Panlipunan import.');
  }
  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUBJECT_PROFILES)
    ) !== before.profileChecksum
  ) {
    errors.push('SUBJECT_PROFILES changed during Araling Panlipunan import.');
  }

  validateAralingPanlipunanTuplesInactive_(sourceRows, errors);
  return createAralingPanlipunanCommitValidationReport_(
    errors,
    sourceRows.length
  );
}

function validateAralingPanlipunanCommittedBowRows_(bowSheet, sourceRows, errors) {
  var liveById = {};
  getSheetObjects_(bowSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      liveById[key] = liveById[key] || [];
      liveById[key].push(row);
    }
  });

  sourceRows.forEach(function (sourceRow) {
    var matches = liveById[normalizeForMatch_(sourceRow.BOW_ID)] || [];
    if (matches.length !== 1) {
      errors.push(
        'Expected exactly one imported BOW_DATABASE row for ' +
        sourceRow.BOW_ID + ', found ' + matches.length + '.'
      );
      return;
    }

    var liveRow = matches[0];
    BOW_HEADERS.forEach(function (header) {
      var expected = header === 'Notes'
        ? sourceRow.ExtractionNotes
        : sourceRow[header];
      if (
        normalizeAralingPanlipunanCommittedField_(header, liveRow[header]) !==
        normalizeAralingPanlipunanCommittedField_(header, expected)
      ) {
        errors.push(
          sourceRow.BOW_ID +
          ' does not match staging field ' + header + '.'
        );
      }
    });
  });
}

function validateAralingPanlipunanCommittedAuditRows_(
  auditSheet,
  sourceRows,
  importBatch,
  errors
) {
  var batchRows = [];
  var auditMatches = {};
  getSheetObjects_(auditSheet).forEach(function (row) {
    if (String(row.ImportBatch || '') !== importBatch) {
      return;
    }
    batchRows.push(row);
    var key = normalizeForMatch_(row.BOW_ID);
    auditMatches[key] = auditMatches[key] || [];
    auditMatches[key].push(row);
  });

  sourceRows.forEach(function (sourceRow) {
    var matches = auditMatches[normalizeForMatch_(sourceRow.BOW_ID)] || [];
    if (matches.length !== 1) {
      errors.push(
        'Expected exactly one audit row for ' +
        sourceRow.BOW_ID + ' in batch ' + importBatch +
        ', found ' + matches.length + '.'
      );
      return;
    }

    var auditRow = matches[0];
    ['SourceFile', 'SourcePage', 'ExtractionNotes'].forEach(function (header) {
      if (
        normalizeAralingPanlipunanCommittedField_(header, auditRow[header]) !==
        normalizeAralingPanlipunanCommittedField_(header, sourceRow[header])
      ) {
        errors.push(
          sourceRow.BOW_ID +
          ' audit field does not match staging: ' + header + '.'
        );
      }
    });
    if (String(auditRow.ImportBatch || '') !== importBatch) {
      errors.push(sourceRow.BOW_ID + ' has an incorrect ImportBatch value.');
    }
    if (!auditRow.ImportedAt) {
      errors.push(sourceRow.BOW_ID + ' has a blank ImportedAt value.');
    }
  });

  if (batchRows.length !== sourceRows.length) {
    errors.push(
      'Audit batch ' + importBatch +
      ' contains ' + batchRows.length +
      ' row(s), expected ' + sourceRows.length + '.'
    );
  }
  validateAralingPanlipunanLiteralSourcePages_(
    batchRows,
    'committed audit batch ' + importBatch,
    errors
  );
}

function validateAralingPanlipunanLiteralSourcePages_(rows, label, errors) {
  var expectedById = {
    'BOW-G6-AP-T2-W8-9-A': '3-4',
    'BOW-G6-AP-T2-W8-9-B': '3-4',
    'BOW-G7-AP-T2-W8-9': '4-5'
  };
  var rowsById = {};
  (rows || []).forEach(function (row) {
    var bowId = String(row.BOW_ID || '').trim();
    if (expectedById.hasOwnProperty(bowId)) {
      rowsById[bowId] = rowsById[bowId] || [];
      rowsById[bowId].push(row);
    }
  });

  Object.keys(expectedById).forEach(function (bowId) {
    var matches = rowsById[bowId] || [];
    if (matches.length !== 1) {
      errors.push(
        label + ' must contain exactly one ' + bowId +
        ' row for SourcePage text verification; found ' + matches.length + '.'
      );
      return;
    }
    var sourcePage = matches[0].SourcePage;
    if (
      typeof sourcePage !== 'string' ||
      sourcePage !== expectedById[bowId]
    ) {
      errors.push(
        bowId + ' SourcePage in ' + label +
        ' must remain literal text "' + expectedById[bowId] +
        '", found "' + String(sourcePage) + '".'
      );
    }
  });
}

function rollbackAralingPanlipunanBowImport_(context) {
  var errors = [];
  var bowRestored = false;
  var auditRestored = false;

  try {
    restoreSheetFromImportBackup_(context.bowSheet, context.bowBackup);
    bowRestored = true;
  } catch (err) {
    errors.push(
      'BOW_DATABASE restore failed: ' +
      (err && err.message ? err.message : String(err))
    );
  }

  try {
    restoreSheetFromImportBackup_(context.auditSheet, context.auditBackup);
    auditRestored = true;
  } catch (err) {
    errors.push(
      'BOW_DATABASE_AUDIT restore failed: ' +
      (err && err.message ? err.message : String(err))
    );
  }

  try {
    SpreadsheetApp.flush();
  } catch (err) {
    errors.push(
      'Rollback flush failed: ' +
      (err && err.message ? err.message : String(err))
    );
  }

  if (bowRestored) {
    var bowRowCount = Math.max(context.bowSheet.getLastRow() - 1, 0);
    if (
      bowRowCount !== context.beforeState.bowRowCount ||
      checksumSheetData_(context.bowSheet) !== context.beforeState.bowChecksum
    ) {
      errors.push('BOW_DATABASE rollback verification failed.');
      bowRestored = false;
    }
  }
  if (auditRestored) {
    var auditRowCount = Math.max(context.auditSheet.getLastRow() - 1, 0);
    if (
      auditRowCount !== context.beforeState.auditRowCount ||
      checksumSheetData_(context.auditSheet) !== context.beforeState.auditChecksum
    ) {
      errors.push('BOW_DATABASE_AUDIT rollback verification failed.');
      auditRestored = false;
    }
  }

  var valid = bowRestored && auditRestored && errors.length === 0;
  var lines = [
    'BOW_DATABASE: ' + (bowRestored ? 'restored and verified' : 'NOT fully restored'),
    'BOW_DATABASE_AUDIT: ' +
      (auditRestored ? 'restored and verified' : 'NOT fully restored'),
    'Rollback complete: ' + (valid ? 'Yes' : 'No')
  ];
  if (errors.length) {
    lines.push('Rollback errors: ' + errors.join(' | '));
  }
  return {
    valid: valid,
    errors: errors,
    text: lines.join('; ')
  };
}

function createAralingPanlipunanCommitValidationReport_(errors, importedRows) {
  var valid = errors.length === 0;
  var lines = [
    valid
      ? 'Araling Panlipunan BOW post-import validation passed.'
      : 'Araling Panlipunan BOW post-import validation failed.',
    'Imported review-only rows: ' + importedRows,
    'Validated grade-term tuples: ' + BOW_AP_IMPORT_EXPECTED_TUPLES_.length,
    'SUPPORT_MATRIX activation changes: 0',
    'SUBJECT_PROFILES changes: 0',
    'Validation errors: ' + errors.length
  ];
  if (errors.length) {
    lines.push('', errors.slice(0, 20).join('\n'));
    if (errors.length > 20) {
      lines.push('Additional errors omitted: ' + (errors.length - 20) + '.');
    }
  }
  return {
    valid: valid,
    errors: errors,
    text: lines.join('\n')
  };
}

function prepareGmrcValuesBowImportStaging() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(BOW_GMRC_VALUES_IMPORT_STAGING_SHEET_);
  var weekNumberColumn = BOW_MATH_IMPORT_HEADERS_.indexOf('WeekNumber') + 1;
  var sourcePageColumn = BOW_MATH_IMPORT_HEADERS_.indexOf('SourcePage') + 1;

  if (!sheet) {
    sheet = spreadsheet.insertSheet(BOW_GMRC_VALUES_IMPORT_STAGING_SHEET_);
    sheet.getRange(1, 1, 1, BOW_MATH_IMPORT_HEADERS_.length)
      .setValues([BOW_MATH_IMPORT_HEADERS_]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() > 1) {
    throw new Error(
      BOW_GMRC_VALUES_IMPORT_STAGING_SHEET_ +
      ' already contains data. It was not cleared or overwritten.'
    );
  } else {
    assertExactSheetHeaders_(
      sheet,
      BOW_MATH_IMPORT_HEADERS_,
      BOW_GMRC_VALUES_IMPORT_STAGING_SHEET_
    );
  }

  sheet.getRange(2, weekNumberColumn, sheet.getMaxRows() - 1, 1)
    .setNumberFormat('@');
  sheet.getRange(2, sourcePageColumn, sheet.getMaxRows() - 1, 1)
    .setNumberFormat('@');

  var result = {
    sheetName: BOW_GMRC_VALUES_IMPORT_STAGING_SHEET_,
    headers: BOW_MATH_IMPORT_HEADERS_.slice(),
    expectedRows: BOW_GMRC_VALUES_IMPORT_EXPECTED_SOURCE_ROWS_,
    message: (
      BOW_GMRC_VALUES_IMPORT_STAGING_SHEET_ +
      ' is ready. Paste the reviewed GMRC / Values Education BOW CSV into this sheet, then run dryRunGmrcValuesBowImport.'
    )
  };
  Logger.log(result.message);
  return result;
}

function dryRunGmrcValuesBowImport() {
  var report = buildGmrcValuesBowImportDryRun_();
  Logger.log(report.text);
  return report;
}

function commitGmrcValuesBowImport() {
  var initialReport = buildGmrcValuesBowImportDryRun_();
  assertGmrcValuesBowCommitReadiness_(initialReport);

  var result = withScriptLock_(function () {
    var report = buildGmrcValuesBowImportDryRun_();
    assertGmrcValuesBowCommitReadiness_(report);

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var bowSheet = requireExistingSheet_(spreadsheet, SHEET_NAMES.BOW_DATABASE);
    var auditSheet = requireExistingSheet_(spreadsheet, BOW_MATH_IMPORT_AUDIT_SHEET_);
    assertExactSheetHeaders_(
      auditSheet,
      BOW_MATH_IMPORT_AUDIT_HEADERS_,
      BOW_MATH_IMPORT_AUDIT_SHEET_
    );

    var timestamp = Utilities.formatDate(
      now_(),
      Session.getScriptTimeZone(),
      'yyyyMMdd_HHmmss'
    );
    var importBatch = 'GMRC_VALUES_REVIEW_' + timestamp;
    var bowBackup = createImportBackupSheet_(
      spreadsheet,
      bowSheet,
      'BOW_DATABASE_BACKUP_GMRC_VALUES_' + timestamp
    );
    var auditBackup = createImportBackupSheet_(
      spreadsheet,
      auditSheet,
      'BOW_AUDIT_BACKUP_GMRC_VALUES_' + timestamp
    );
    var beforeState = captureEnglishBowImportState_(
      spreadsheet,
      bowSheet,
      auditSheet
    );

    try {
      appendGmrcValuesBowImportRows_(bowSheet, report.sourceData);
      appendGmrcValuesBowAuditRows_(auditSheet, report.sourceData, importBatch);
      SpreadsheetApp.flush();

      var validation = validateCommittedGmrcValuesBowImport_({
        spreadsheet: spreadsheet,
        bowSheet: bowSheet,
        auditSheet: auditSheet,
        sourceRows: report.sourceData,
        importBatch: importBatch,
        beforeState: beforeState
      });
      if (!validation.valid) {
        throw new Error(
          'Post-import validation failed:\n' + validation.errors.join('\n')
        );
      }

      return {
        committed: true,
        importBatch: importBatch,
        importedRows: report.sourceData.length,
        bowBackupSheet: bowBackup.getName(),
        auditBackupSheet: auditBackup.getName(),
        validationText: validation.text
      };
    } catch (err) {
      var originalMessage = err && err.message ? err.message : String(err);
      var rollback = rollbackGmrcValuesBowImport_({
        bowSheet: bowSheet,
        bowBackup: bowBackup,
        auditSheet: auditSheet,
        auditBackup: auditBackup,
        beforeState: beforeState
      });
      throw new Error(
        'GMRC / Values Education BOW import failed: ' + originalMessage +
        '\nRollback result: ' + rollback.text
      );
    }
  }, 30000);

  Logger.log(
    'GMRC / Values Education BOW review import completed.\n\n' +
    'Batch: ' + result.importBatch + '\n' +
    'Imported rows: ' + result.importedRows + '\n' +
    'BOW backup: ' + result.bowBackupSheet + '\n' +
    'Audit backup: ' + result.auditBackupSheet + '\n\n' +
    result.validationText
  );
  return result;
}

function buildGmrcValuesBowImportDryRun_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var errors = [];
  var stagingSheet = spreadsheet.getSheetByName(BOW_GMRC_VALUES_IMPORT_STAGING_SHEET_);

  if (!stagingSheet) {
    return createGmrcValuesBowImportReport_(
      [
        'Missing staging sheet: ' + BOW_GMRC_VALUES_IMPORT_STAGING_SHEET_ +
        '. Run prepareGmrcValuesBowImportStaging and paste the reviewed CSV first.'
      ],
      [],
      0
    );
  }

  try {
    assertExactSheetHeaders_(
      stagingSheet,
      BOW_MATH_IMPORT_HEADERS_,
      BOW_GMRC_VALUES_IMPORT_STAGING_SHEET_
    );
  } catch (err) {
    errors.push(err.message);
  }

  var sourceRows = readGmrcValuesBowStagingRows_(stagingSheet);
  if (sourceRows.length !== BOW_GMRC_VALUES_IMPORT_EXPECTED_SOURCE_ROWS_) {
    errors.push(
      'Expected exactly ' + BOW_GMRC_VALUES_IMPORT_EXPECTED_SOURCE_ROWS_ +
      ' source rows, found ' + sourceRows.length + '.'
    );
  }

  validateGmrcValuesBowSourceRows_(sourceRows, errors);
  validateGmrcValuesExpectedCounts_(sourceRows, errors);
  validateGmrcValuesRowsAgainstLiveData_(spreadsheet, sourceRows, errors);
  validateGmrcValuesTuplesInactive_(sourceRows, errors);

  return createGmrcValuesBowImportReport_(
    errors,
    sourceRows,
    sourceRows.length
  );
}

function readGmrcValuesBowStagingRows_(sheet) {
  if (sheet.getLastRow() < 2) {
    return [];
  }

  var values = sheet.getRange(
    2,
    1,
    sheet.getLastRow() - 1,
    BOW_MATH_IMPORT_HEADERS_.length
  ).getValues();
  return values.map(function (row) {
    var object = {};
    BOW_MATH_IMPORT_HEADERS_.forEach(function (header, index) {
      object[header] = row[index];
    });
    return object;
  });
}

function validateGmrcValuesBowSourceRows_(rows, errors) {
  var seenIds = {};

  rows.forEach(function (row, index) {
    var rowLabel = 'Staging row ' + (index + 2);

    if (row.SourcePage instanceof Date) {
      errors.push(
        rowLabel +
        ' SourcePage was converted to a date by Sheets. Re-enter it as plain text before importing.'
      );
    }
    if (row.WeekNumber instanceof Date) {
      errors.push(
        rowLabel +
        ' WeekNumber was converted to a date by Sheets. Re-enter it as plain text before importing.'
      );
    }

    BOW_MATH_IMPORT_HEADERS_.forEach(function (fieldName) {
      if (!String(row[fieldName] || '').trim()) {
        errors.push(rowLabel + ' is missing ' + fieldName + '.');
      }
    });

    var bowId = String(row.BOW_ID || '').trim();
    var bowIdKey = normalizeForMatch_(bowId);
    if (bowIdKey) {
      if (seenIds[bowIdKey]) {
        errors.push('Duplicate source BOW_ID: ' + bowId + '.');
      }
      seenIds[bowIdKey] = true;
    }

    validateGmrcValuesBowIdentity_(row, rowLabel, errors);
  });
}

function validateGmrcValuesBowIdentity_(row, rowLabel, errors) {
  var gradeMatch = String(row.GradeLevel || '').trim().match(/^Grade (10|[1-9])$/);
  if (!gradeMatch) {
    errors.push(rowLabel + ' has invalid GradeLevel: ' + row.GradeLevel + '.');
    return;
  }

  var grade = Number(gradeMatch[1]);
  var subjectEntry = BOW_GMRC_VALUES_SUBJECT_BY_GRADE_[grade];
  if (!subjectEntry) {
    errors.push(
      rowLabel + ' has no GMRC / Values Education subject mapping for GradeLevel: ' +
      row.GradeLevel + '.'
    );
    return;
  }

  if (String(row.Subject || '').trim() !== subjectEntry.name) {
    errors.push(
      rowLabel + ' must use Subject "' + subjectEntry.name + '" for ' +
      row.GradeLevel + '.'
    );
  }

  var termNumber = termNumberGmrcValuesBow_(row.Term);
  if (!termNumber) {
    errors.push(rowLabel + ' has invalid Term: ' + row.Term + '.');
    return;
  }

  var week = parseBowWeekRange_(row.WeekNumber);
  if (!week.valid) {
    errors.push(
      rowLabel + ' has invalid WeekNumber: ' + row.WeekNumber + '. ' +
      week.reason
    );
    return;
  }

  var weekId = week.end > week.start
    ? 'W' + week.start + '-' + week.end
    : 'W' + week.start;
  var expectedId =
    'BOW-G' + grade + '-' + subjectEntry.code + '-T' + termNumber + '-' + weekId;
  var bowId = String(row.BOW_ID || '').trim();
  var idPattern = new RegExp('^' + escapeRegExp_(expectedId) + '(?:-[A-Z])?$');
  if (!idPattern.test(bowId)) {
    errors.push(
      rowLabel + ' must use BOW_ID ' + expectedId +
      ' (optionally with a single -A style capital-letter suffix), found ' +
      row.BOW_ID + '.'
    );
  }
}

function validateGmrcValuesExpectedCounts_(rows, errors) {
  var expectedTuples = {};
  var actualTuples = {};
  var subjectCounts = {};
  var terms = ['First Term', 'Second Term', 'Third Term'];

  Object.keys(BOW_GMRC_VALUES_SUBJECT_BY_GRADE_).forEach(function (gradeText) {
    var grade = Number(gradeText);
    var subject = BOW_GMRC_VALUES_SUBJECT_BY_GRADE_[grade].name;
    terms.forEach(function (term) {
      expectedTuples[
        supportMatrixKey_('Grade ' + grade, subject, term)
      ] = {
        GradeLevel: 'Grade ' + grade,
        Subject: subject,
        Term: term
      };
    });
  });

  rows.forEach(function (row) {
    var subject = String(row.Subject || '').trim();
    if (subject) {
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
    }
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    actualTuples[key] = actualTuples[key] || [];
    actualTuples[key].push(row);
  });

  if (Object.keys(actualTuples).length !== BOW_GMRC_VALUES_IMPORT_EXPECTED_TUPLES_) {
    errors.push(
      'Expected exactly ' + BOW_GMRC_VALUES_IMPORT_EXPECTED_TUPLES_ +
      ' populated GMRC / Values Education grade/subject/term tuples, found ' +
      Object.keys(actualTuples).length + '.'
    );
  }

  Object.keys(expectedTuples).forEach(function (key) {
    if (!actualTuples[key] || !actualTuples[key].length) {
      var expected = expectedTuples[key];
      errors.push(
        'Missing expected GMRC / Values Education tuple: ' +
        expected.GradeLevel + ' / ' + expected.Subject + ' / ' + expected.Term + '.'
      );
    }
  });

  Object.keys(actualTuples).forEach(function (key) {
    if (!expectedTuples[key]) {
      var row = actualTuples[key][0];
      errors.push(
        'Unexpected GMRC / Values Education import tuple: ' +
        row.GradeLevel + ' / ' + row.Subject + ' / ' + row.Term + '.'
      );
    }
  });

  Object.keys(BOW_GMRC_VALUES_IMPORT_EXPECTED_SUBJECT_COUNTS_).forEach(function (subject) {
    var expectedCount = BOW_GMRC_VALUES_IMPORT_EXPECTED_SUBJECT_COUNTS_[subject];
    var actualCount = subjectCounts[subject] || 0;
    if (actualCount !== expectedCount) {
      errors.push(
        subject + ' expected ' + expectedCount +
        ' row(s), found ' + actualCount + '.'
      );
    }
  });

  Object.keys(subjectCounts).forEach(function (subject) {
    if (!BOW_GMRC_VALUES_IMPORT_EXPECTED_SUBJECT_COUNTS_.hasOwnProperty(subject)) {
      errors.push('Unexpected GMRC / Values Education import Subject: ' + subject + '.');
    }
  });
}

function validateGmrcValuesRowsAgainstLiveData_(spreadsheet, sourceRows, errors) {
  var bowSheet = spreadsheet.getSheetByName(SHEET_NAMES.BOW_DATABASE);
  if (!bowSheet) {
    errors.push('Missing live sheet: ' + SHEET_NAMES.BOW_DATABASE + '.');
    return;
  }

  try {
    assertRequiredHeaders_(bowSheet, BOW_HEADERS, SHEET_NAMES.BOW_DATABASE);
  } catch (err) {
    errors.push(err.message);
    return;
  }

  var auditSheet = spreadsheet.getSheetByName(BOW_MATH_IMPORT_AUDIT_SHEET_);
  if (!auditSheet) {
    errors.push('Missing required audit sheet: ' + BOW_MATH_IMPORT_AUDIT_SHEET_ + '.');
    return;
  }
  try {
    assertExactSheetHeaders_(
      auditSheet,
      BOW_MATH_IMPORT_AUDIT_HEADERS_,
      BOW_MATH_IMPORT_AUDIT_SHEET_
    );
  } catch (err) {
    errors.push(err.message);
    return;
  }

  var existingBowIds = {};
  getSheetObjects_(bowSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      existingBowIds[key] = true;
    }
  });

  var auditedIds = {};
  getSheetObjects_(auditSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      auditedIds[key] = true;
    }
  });

  sourceRows.forEach(function (row) {
    var bowId = String(row.BOW_ID || '').trim();
    var key = normalizeForMatch_(bowId);
    if (existingBowIds[key]) {
      errors.push(
        'Incoming GMRC / Values Education BOW_ID already exists in BOW_DATABASE: ' +
        bowId + '.'
      );
    }
    if (auditedIds[key]) {
      errors.push(
        'Incoming GMRC / Values Education BOW_ID already exists in BOW_DATABASE_AUDIT: ' +
        bowId + '.'
      );
    }
  });
}

function validateGmrcValuesTuplesInactive_(rows, errors) {
  var checked = {};

  rows.forEach(function (row) {
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    if (checked[key]) {
      return;
    }
    checked[key] = true;

    var support = getSupportStatus_(row);
    if (support.supported) {
      errors.push(
        'GMRC / Values Education review tuple is already processable and must remain inactive: ' +
        row.GradeLevel + ' / ' + row.Subject + ' / ' + row.Term + '.'
      );
    }
  });
}

function createGmrcValuesBowImportReport_(errors, sourceRows, sourceRowCount) {
  var valid = errors.length === 0;
  var tuples = {};
  var subjectCounts = {};

  (sourceRows || []).forEach(function (row) {
    tuples[supportMatrixKey_(row.GradeLevel, row.Subject, row.Term)] = true;
    var subject = String(row.Subject || '').trim();
    if (subject) {
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
    }
  });

  var subjectLine = Object.keys(BOW_GMRC_VALUES_IMPORT_EXPECTED_SUBJECT_COUNTS_)
    .map(function (subject) {
      return subject + ' ' + (subjectCounts[subject] || 0) +
        ' / ' + BOW_GMRC_VALUES_IMPORT_EXPECTED_SUBJECT_COUNTS_[subject];
    })
    .join(', ');

  var lines = [
    valid
      ? 'GMRC / Values Education BOW import dry run passed.'
      : 'GMRC / Values Education BOW import dry run failed.',
    'Source rows: ' + sourceRowCount +
      ' / ' + BOW_GMRC_VALUES_IMPORT_EXPECTED_SOURCE_ROWS_,
    'Detected grade/subject/term tuples: ' + Object.keys(tuples).length +
      ' / ' + BOW_GMRC_VALUES_IMPORT_EXPECTED_TUPLES_,
    'Subject rows: ' + subjectLine,
    'GMRC / Values Education review rows eligible to append: ' +
      (valid ? sourceRows.length : 0),
    'Validation errors: ' + errors.length
  ];

  if (errors.length) {
    lines.push('', errors.slice(0, 20).join('\n'));
    if (errors.length > 20) {
      lines.push('Additional errors omitted: ' + (errors.length - 20) + '.');
    }
  }

  return {
    valid: valid,
    errors: errors,
    sourceRows: sourceRowCount,
    sourceData: sourceRows,
    text: lines.join('\n')
  };
}

function assertGmrcValuesBowCommitReadiness_(report) {
  if (!report || !report.valid) {
    throw new Error(
      'GMRC / Values Education BOW import dry run failed:\n' +
      ((report && report.errors) || ['No dry-run report was returned.']).join('\n')
    );
  }

  var sourceRows = report.sourceData || [];
  var errors = [];
  if (sourceRows.length !== BOW_GMRC_VALUES_IMPORT_EXPECTED_SOURCE_ROWS_) {
    errors.push(
      'Commit requires exactly ' + BOW_GMRC_VALUES_IMPORT_EXPECTED_SOURCE_ROWS_ +
      ' eligible rows, found ' + sourceRows.length + '.'
    );
  }
  validateGmrcValuesExpectedCounts_(sourceRows, errors);

  if (errors.length) {
    throw new Error(
      'GMRC / Values Education commit readiness validation failed:\n' +
      errors.join('\n')
    );
  }
}

function appendGmrcValuesBowImportRows_(bowSheet, sourceRows) {
  var headerMap = getHeaderMap_(bowSheet);
  var lastColumn = bowSheet.getLastColumn();
  var values = sourceRows.map(function (sourceRow) {
    var row = new Array(lastColumn).fill('');
    BOW_HEADERS.forEach(function (header) {
      var value = header === 'Notes'
        ? sourceRow.ExtractionNotes
        : sourceRow[header];
      if (header === 'WeekNumber') {
        row[headerMap[header] - 1] = normalizeGmrcValuesComparableText_(value);
      } else if (header === 'SourcePage') {
        row[headerMap[header] - 1] = normalizeGmrcValuesComparableText_(value);
      } else {
        row[headerMap[header] - 1] = value;
      }
    });
    if (headerMap.SourcePage) {
      row[headerMap.SourcePage - 1] =
        normalizeGmrcValuesComparableText_(sourceRow.SourcePage);
    }
    return row;
  });

  if (values.length) {
    var startRow = bowSheet.getLastRow() + 1;
    if (headerMap.WeekNumber) {
      bowSheet.getRange(startRow, headerMap.WeekNumber, values.length, 1)
        .setNumberFormat('@');
    }
    if (headerMap.SourcePage) {
      bowSheet.getRange(startRow, headerMap.SourcePage, values.length, 1)
        .setNumberFormat('@');
    }
    bowSheet.getRange(
      startRow,
      1,
      values.length,
      lastColumn
    ).setValues(values);
  }
}

function appendGmrcValuesBowAuditRows_(auditSheet, sourceRows, importBatch) {
  var importedAt = now_();
  var values = sourceRows.map(function (row) {
    return [
      row.BOW_ID,
      row.SourceFile,
      normalizeGmrcValuesComparableText_(row.SourcePage),
      row.ExtractionNotes,
      importBatch,
      importedAt
    ];
  });

  if (values.length) {
    var startRow = auditSheet.getLastRow() + 1;
    auditSheet.getRange(startRow, 3, values.length, 1).setNumberFormat('@');
    auditSheet.getRange(
      startRow,
      1,
      values.length,
      values[0].length
    ).setValues(values);
  }
}

function normalizeGmrcValuesComparableText_(value) {
  if (value === null || typeof value === 'undefined') {
    return '';
  }
  return String(value).replace(/\s+/g, ' ').trim();
}

function normalizeGmrcValuesCommittedField_(fieldName, value) {
  if (fieldName === 'WeekNumber' || fieldName === 'SourcePage') {
    return normalizeGmrcValuesComparableText_(value);
  }
  return normalizeImportCell_(value);
}

function validateCommittedGmrcValuesBowImport_(context) {
  var errors = [];
  var sourceRows = context.sourceRows;
  var before = context.beforeState;
  var bowRowCountAfter = Math.max(context.bowSheet.getLastRow() - 1, 0);
  var auditRowCountAfter = Math.max(context.auditSheet.getLastRow() - 1, 0);

  if (bowRowCountAfter - before.bowRowCount !== sourceRows.length) {
    errors.push(
      'BOW_DATABASE row count changed by ' +
      (bowRowCountAfter - before.bowRowCount) +
      ', expected ' + sourceRows.length + '.'
    );
  }
  if (auditRowCountAfter - before.auditRowCount !== sourceRows.length) {
    errors.push(
      'BOW_DATABASE_AUDIT row count changed by ' +
      (auditRowCountAfter - before.auditRowCount) +
      ', expected ' + sourceRows.length + '.'
    );
  }

  var existingBowChecksumAfter = checksumValues_(
    context.bowSheet.getRange(
      1,
      1,
      before.bowRegionRows,
      before.bowRegionColumns
    ).getValues()
  );
  if (existingBowChecksumAfter !== before.bowChecksum) {
    errors.push(
      'Pre-existing BOW_DATABASE rows changed during GMRC / Values Education import.'
    );
  }

  var existingAuditChecksumAfter = checksumValues_(
    context.auditSheet.getRange(
      1,
      1,
      before.auditRegionRows,
      before.auditRegionColumns
    ).getValues()
  );
  if (existingAuditChecksumAfter !== before.auditChecksum) {
    errors.push(
      'Pre-existing BOW_DATABASE_AUDIT rows changed during GMRC / Values Education import.'
    );
  }

  validateGmrcValuesCommittedBowRows_(
    context.bowSheet,
    sourceRows,
    errors
  );
  validateGmrcValuesCommittedAuditRows_(
    context.auditSheet,
    sourceRows,
    context.importBatch,
    errors
  );
  validateGmrcValuesExpectedCounts_(sourceRows, errors);

  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUPPORT_MATRIX)
    ) !== before.supportChecksum
  ) {
    errors.push('SUPPORT_MATRIX changed during GMRC / Values Education import.');
  }
  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUBJECT_PROFILES)
    ) !== before.profileChecksum
  ) {
    errors.push('SUBJECT_PROFILES changed during GMRC / Values Education import.');
  }

  validateGmrcValuesTuplesInactive_(sourceRows, errors);
  return createGmrcValuesCommitValidationReport_(
    errors,
    sourceRows.length
  );
}

function validateGmrcValuesCommittedBowRows_(bowSheet, sourceRows, errors) {
  var liveById = {};
  getSheetObjects_(bowSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      liveById[key] = liveById[key] || [];
      liveById[key].push(row);
    }
  });

  sourceRows.forEach(function (sourceRow) {
    var matches = liveById[normalizeForMatch_(sourceRow.BOW_ID)] || [];
    if (matches.length !== 1) {
      errors.push(
        'Expected exactly one imported BOW_DATABASE row for ' +
        sourceRow.BOW_ID + ', found ' + matches.length + '.'
      );
      return;
    }

    var liveRow = matches[0];
    BOW_HEADERS.forEach(function (header) {
      var expected = header === 'Notes'
        ? sourceRow.ExtractionNotes
        : sourceRow[header];
      if (
        normalizeGmrcValuesCommittedField_(header, liveRow[header]) !==
        normalizeGmrcValuesCommittedField_(header, expected)
      ) {
        errors.push(
          sourceRow.BOW_ID +
          ' does not match staging field ' + header + '.'
        );
      }
    });
  });
}

function validateGmrcValuesCommittedAuditRows_(
  auditSheet,
  sourceRows,
  importBatch,
  errors
) {
  var batchRows = [];
  var auditMatches = {};
  getSheetObjects_(auditSheet).forEach(function (row) {
    if (String(row.ImportBatch || '') !== importBatch) {
      return;
    }
    batchRows.push(row);
    var key = normalizeForMatch_(row.BOW_ID);
    auditMatches[key] = auditMatches[key] || [];
    auditMatches[key].push(row);
  });

  sourceRows.forEach(function (sourceRow) {
    var matches = auditMatches[normalizeForMatch_(sourceRow.BOW_ID)] || [];
    if (matches.length !== 1) {
      errors.push(
        'Expected exactly one audit row for ' +
        sourceRow.BOW_ID + ' in batch ' + importBatch +
        ', found ' + matches.length + '.'
      );
      return;
    }

    var auditRow = matches[0];
    ['SourceFile', 'SourcePage', 'ExtractionNotes'].forEach(function (header) {
      if (
        normalizeGmrcValuesCommittedField_(header, auditRow[header]) !==
        normalizeGmrcValuesCommittedField_(header, sourceRow[header])
      ) {
        errors.push(
          sourceRow.BOW_ID +
          ' audit field does not match staging: ' + header + '.'
        );
      }
    });
    if (String(auditRow.ImportBatch || '') !== importBatch) {
      errors.push(sourceRow.BOW_ID + ' has an incorrect ImportBatch value.');
    }
    if (!auditRow.ImportedAt) {
      errors.push(sourceRow.BOW_ID + ' has a blank ImportedAt value.');
    }
  });

  if (batchRows.length !== sourceRows.length) {
    errors.push(
      'Audit batch ' + importBatch +
      ' contains ' + batchRows.length +
      ' row(s), expected ' + sourceRows.length + '.'
    );
  }
}

function rollbackGmrcValuesBowImport_(context) {
  var errors = [];
  var bowRestored = false;
  var auditRestored = false;

  try {
    restoreSheetFromImportBackup_(context.bowSheet, context.bowBackup);
    bowRestored = true;
  } catch (err) {
    errors.push(
      'BOW_DATABASE restore failed: ' +
      (err && err.message ? err.message : String(err))
    );
  }

  try {
    restoreSheetFromImportBackup_(context.auditSheet, context.auditBackup);
    auditRestored = true;
  } catch (err) {
    errors.push(
      'BOW_DATABASE_AUDIT restore failed: ' +
      (err && err.message ? err.message : String(err))
    );
  }

  try {
    SpreadsheetApp.flush();
  } catch (err) {
    errors.push(
      'Rollback flush failed: ' +
      (err && err.message ? err.message : String(err))
    );
  }

  if (bowRestored) {
    var bowRowCount = Math.max(context.bowSheet.getLastRow() - 1, 0);
    if (
      bowRowCount !== context.beforeState.bowRowCount ||
      checksumSheetData_(context.bowSheet) !== context.beforeState.bowChecksum
    ) {
      errors.push('BOW_DATABASE rollback verification failed.');
      bowRestored = false;
    }
  }
  if (auditRestored) {
    var auditRowCount = Math.max(context.auditSheet.getLastRow() - 1, 0);
    if (
      auditRowCount !== context.beforeState.auditRowCount ||
      checksumSheetData_(context.auditSheet) !== context.beforeState.auditChecksum
    ) {
      errors.push('BOW_DATABASE_AUDIT rollback verification failed.');
      auditRestored = false;
    }
  }

  var valid = bowRestored && auditRestored && errors.length === 0;
  var lines = [
    'BOW_DATABASE: ' + (bowRestored ? 'restored and verified' : 'NOT fully restored'),
    'BOW_DATABASE_AUDIT: ' +
      (auditRestored ? 'restored and verified' : 'NOT fully restored'),
    'Rollback complete: ' + (valid ? 'Yes' : 'No')
  ];
  if (errors.length) {
    lines.push('Rollback errors: ' + errors.join(' | '));
  }
  return {
    valid: valid,
    errors: errors,
    text: lines.join('; ')
  };
}

function createGmrcValuesCommitValidationReport_(errors, importedRows) {
  var valid = errors.length === 0;
  var lines = [
    valid
      ? 'GMRC / Values Education BOW post-import validation passed.'
      : 'GMRC / Values Education BOW post-import validation failed.',
    'Imported review-only rows: ' + importedRows,
    'Validated grade/subject/term tuples: ' +
      BOW_GMRC_VALUES_IMPORT_EXPECTED_TUPLES_,
    'BOW_PACING_METADATA changes: 0',
    'SUPPORT_MATRIX activation changes: 0',
    'SUBJECT_PROFILES changes: 0',
    'Validation errors: ' + errors.length
  ];
  if (errors.length) {
    lines.push('', errors.slice(0, 20).join('\n'));
    if (errors.length > 20) {
      lines.push('Additional errors omitted: ' + (errors.length - 20) + '.');
    }
  }
  return {
    valid: valid,
    errors: errors,
    text: lines.join('\n')
  };
}

function termNumberGmrcValuesBow_(term) {
  var map = {
    'First Term': 1,
    'Second Term': 2,
    'Third Term': 3
  };
  return map[String(term || '').trim()] || 0;
}

function prepareMapehBowImportStaging() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(BOW_MAPEH_IMPORT_STAGING_SHEET_);
  var weekNumberColumn = BOW_MATH_IMPORT_HEADERS_.indexOf('WeekNumber') + 1;
  var sourcePageColumn = BOW_MATH_IMPORT_HEADERS_.indexOf('SourcePage') + 1;

  if (!sheet) {
    sheet = spreadsheet.insertSheet(BOW_MAPEH_IMPORT_STAGING_SHEET_);
    sheet.getRange(1, 1, 1, BOW_MATH_IMPORT_HEADERS_.length)
      .setValues([BOW_MATH_IMPORT_HEADERS_]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() > 1) {
    throw new Error(
      BOW_MAPEH_IMPORT_STAGING_SHEET_ +
      ' already contains data. It was not cleared or overwritten.'
    );
  } else {
    assertExactSheetHeaders_(
      sheet,
      BOW_MATH_IMPORT_HEADERS_,
      BOW_MAPEH_IMPORT_STAGING_SHEET_
    );
  }

  sheet.getRange(2, weekNumberColumn, sheet.getMaxRows() - 1, 1)
    .setNumberFormat('@');
  sheet.getRange(2, sourcePageColumn, sheet.getMaxRows() - 1, 1)
    .setNumberFormat('@');

  var result = {
    sheetName: BOW_MAPEH_IMPORT_STAGING_SHEET_,
    headers: BOW_MATH_IMPORT_HEADERS_.slice(),
    expectedRows: BOW_MAPEH_IMPORT_EXPECTED_SOURCE_ROWS_,
    message: (
      BOW_MAPEH_IMPORT_STAGING_SHEET_ +
      ' is ready. Paste BOW_DATABASE_IMPORT_MAPEH_REVIEW.csv into this sheet, then run dryRunMapehBowImport.'
    )
  };
  Logger.log(result.message);
  return result;
}

function dryRunMapehBowImport() {
  var report = buildMapehBowImportDryRun_();
  Logger.log(report.text);
  return report;
}

function commitMapehBowImport() {
  var initialReport = buildMapehBowImportDryRun_();
  assertMapehBowCommitReadiness_(initialReport);

  var result = withScriptLock_(function () {
    var report = buildMapehBowImportDryRun_();
    assertMapehBowCommitReadiness_(report);

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var bowSheet = requireExistingSheet_(spreadsheet, SHEET_NAMES.BOW_DATABASE);
    var auditSheet = requireExistingSheet_(spreadsheet, BOW_MATH_IMPORT_AUDIT_SHEET_);
    assertExactSheetHeaders_(
      auditSheet,
      BOW_MATH_IMPORT_AUDIT_HEADERS_,
      BOW_MATH_IMPORT_AUDIT_SHEET_
    );

    var timestamp = Utilities.formatDate(
      now_(),
      Session.getScriptTimeZone(),
      'yyyyMMdd_HHmmss'
    );
    var importBatch = 'MAPEH_REVIEW_' + timestamp;
    var bowBackup = createImportBackupSheet_(
      spreadsheet,
      bowSheet,
      'BOW_DATABASE_BACKUP_MAPEH_' + timestamp
    );
    var auditBackup = createImportBackupSheet_(
      spreadsheet,
      auditSheet,
      'BOW_AUDIT_BACKUP_MAPEH_' + timestamp
    );
    var beforeState = captureMapehBowImportState_(
      spreadsheet,
      bowSheet,
      auditSheet
    );

    try {
      appendMapehBowImportRows_(bowSheet, report.sourceData);
      appendMapehBowAuditRows_(auditSheet, report.sourceData, importBatch);
      SpreadsheetApp.flush();

      var validation = validateCommittedMapehBowImport_({
        spreadsheet: spreadsheet,
        bowSheet: bowSheet,
        auditSheet: auditSheet,
        sourceRows: report.sourceData,
        importBatch: importBatch,
        beforeState: beforeState
      });
      if (!validation.valid) {
        throw new Error(
          'Post-import validation failed:\n' + validation.errors.join('\n')
        );
      }

      return {
        committed: true,
        importBatch: importBatch,
        importedRows: report.sourceData.length,
        bowBackupSheet: bowBackup.getName(),
        auditBackupSheet: auditBackup.getName(),
        validationText: validation.text
      };
    } catch (err) {
      var originalMessage = err && err.message ? err.message : String(err);
      var rollback = rollbackMapehBowImport_({
        bowSheet: bowSheet,
        bowBackup: bowBackup,
        auditSheet: auditSheet,
        auditBackup: auditBackup,
        beforeState: beforeState
      });
      throw new Error(
        'MAPEH BOW import failed: ' + originalMessage +
        '\nRollback result: ' + rollback.text
      );
    }
  }, 30000);

  Logger.log(
    'MAPEH BOW review import completed.\n\n' +
    'Batch: ' + result.importBatch + '\n' +
    'Imported rows: ' + result.importedRows + '\n' +
    'BOW backup: ' + result.bowBackupSheet + '\n' +
    'Audit backup: ' + result.auditBackupSheet + '\n\n' +
    result.validationText
  );
  return result;
}

function buildMapehBowImportDryRun_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var errors = [];
  var stagingSheet = spreadsheet.getSheetByName(BOW_MAPEH_IMPORT_STAGING_SHEET_);

  if (!stagingSheet) {
    return createMapehBowImportReport_(
      [
        'Missing staging sheet: ' + BOW_MAPEH_IMPORT_STAGING_SHEET_ +
        '. Run prepareMapehBowImportStaging and paste BOW_DATABASE_IMPORT_MAPEH_REVIEW.csv first.'
      ],
      [],
      0
    );
  }

  try {
    assertExactSheetHeaders_(
      stagingSheet,
      BOW_MATH_IMPORT_HEADERS_,
      BOW_MAPEH_IMPORT_STAGING_SHEET_
    );
  } catch (err) {
    errors.push(err.message);
  }

  var sourceRows = readMapehBowStagingRows_(stagingSheet);
  if (sourceRows.length !== BOW_MAPEH_IMPORT_EXPECTED_SOURCE_ROWS_) {
    errors.push(
      'Expected exactly ' + BOW_MAPEH_IMPORT_EXPECTED_SOURCE_ROWS_ +
      ' source rows, found ' + sourceRows.length + '.'
    );
  }

  validateMapehBowSourceRows_(sourceRows, errors);
  validateMapehExpectedCounts_(sourceRows, errors);
  validateMapehRowsAgainstLiveData_(spreadsheet, sourceRows, errors);
  validateMapehTuplesInactive_(sourceRows, errors);

  return createMapehBowImportReport_(
    errors,
    sourceRows,
    sourceRows.length
  );
}

function readMapehBowStagingRows_(sheet) {
  if (sheet.getLastRow() < 2) {
    return [];
  }

  var values = sheet.getRange(
    2,
    1,
    sheet.getLastRow() - 1,
    BOW_MATH_IMPORT_HEADERS_.length
  ).getValues();
  return values.map(function (row) {
    var object = {};
    BOW_MATH_IMPORT_HEADERS_.forEach(function (header, index) {
      object[header] = row[index];
    });
    return object;
  });
}

function validateMapehBowSourceRows_(rows, errors) {
  var seenIds = {};

  rows.forEach(function (row, index) {
    var rowLabel = 'Staging row ' + (index + 2);

    if (row.SourcePage instanceof Date) {
      errors.push(
        rowLabel +
        ' SourcePage was converted to a date by Sheets. Re-enter it as plain text before importing.'
      );
    }
    if (row.WeekNumber instanceof Date) {
      errors.push(
        rowLabel +
        ' WeekNumber was converted to a date by Sheets. Re-enter it as plain text before importing.'
      );
    }

    BOW_MATH_IMPORT_HEADERS_.forEach(function (fieldName) {
      if (!String(row[fieldName] || '').trim()) {
        errors.push(rowLabel + ' is missing ' + fieldName + '.');
      }
    });

    var bowId = String(row.BOW_ID || '').trim();
    var bowIdKey = normalizeForMatch_(bowId);
    if (bowIdKey) {
      if (seenIds[bowIdKey]) {
        errors.push('Duplicate source BOW_ID: ' + bowId + '.');
      }
      seenIds[bowIdKey] = true;
    }

    validateMapehBowIdentity_(row, rowLabel, errors);
    validateMapehTeacherReviewLabel_(row, rowLabel, errors);
  });
}

function validateMapehBowIdentity_(row, rowLabel, errors) {
  if (String(row.Subject || '').trim() !== 'MAPEH') {
    errors.push(rowLabel + ' must use Subject "MAPEH", found ' + row.Subject + '.');
  }

  var gradeMatch = String(row.GradeLevel || '').trim().match(/^Grade (10|[4-9])$/);
  if (!gradeMatch) {
    errors.push(rowLabel + ' has invalid GradeLevel for MAPEH: ' + row.GradeLevel + '.');
  }

  var termNumber = termNumberMapehBow_(row.Term);
  if (!termNumber) {
    errors.push(rowLabel + ' has invalid Term: ' + row.Term + '.');
  }

  var domain = String(row.Domain || '').trim();
  if (!BOW_MAPEH_IMPORT_EXPECTED_DOMAIN_COUNTS_.hasOwnProperty(domain)) {
    errors.push(
      rowLabel + ' has invalid Domain: ' + row.Domain +
      '. Expected Music and Arts or Physical Education and Health.'
    );
  }

  var week = parseBowWeekRange_(row.WeekNumber);
  if (!week.valid) {
    errors.push(
      rowLabel + ' has invalid WeekNumber: ' + row.WeekNumber + '. ' +
      week.reason
    );
  }
}

function validateMapehTeacherReviewLabel_(row, rowLabel, errors) {
  ['ContentStandard', 'PerformanceStandard', 'ExtractionNotes'].forEach(function (fieldName) {
    if (String(row[fieldName] || '').indexOf(BOW_MAPEH_IMPORT_REVIEW_LABEL_) === -1) {
      errors.push(
        rowLabel + ' ' + fieldName +
        ' must contain the required teacher-review label.'
      );
    }
  });
}

function validateMapehExpectedCounts_(rows, errors) {
  var expectedTuples = {};
  var actualTuples = {};
  var domainCounts = {};
  var termCounts = {};
  var terms = ['First Term', 'Second Term', 'Third Term'];

  for (var grade = 4; grade <= 10; grade++) {
    terms.forEach(function (term) {
      expectedTuples[
        supportMatrixKey_('Grade ' + grade, 'MAPEH', term)
      ] = {
        GradeLevel: 'Grade ' + grade,
        Subject: 'MAPEH',
        Term: term
      };
    });
  }

  rows.forEach(function (row) {
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    actualTuples[key] = actualTuples[key] || [];
    actualTuples[key].push(row);

    var domain = String(row.Domain || '').trim();
    if (domain) {
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    }

    var term = String(row.Term || '').trim();
    if (term) {
      termCounts[term] = (termCounts[term] || 0) + 1;
    }
  });

  if (Object.keys(actualTuples).length !== BOW_MAPEH_IMPORT_EXPECTED_TUPLES_) {
    errors.push(
      'Expected exactly ' + BOW_MAPEH_IMPORT_EXPECTED_TUPLES_ +
      ' populated MAPEH grade/subject/term tuples, found ' +
      Object.keys(actualTuples).length + '.'
    );
  }

  Object.keys(expectedTuples).forEach(function (key) {
    if (!actualTuples[key] || !actualTuples[key].length) {
      var expected = expectedTuples[key];
      errors.push(
        'Missing expected MAPEH tuple: ' +
        expected.GradeLevel + ' / ' + expected.Subject + ' / ' + expected.Term + '.'
      );
    }
  });

  Object.keys(actualTuples).forEach(function (key) {
    if (!expectedTuples[key]) {
      var row = actualTuples[key][0];
      errors.push(
        'Unexpected MAPEH import tuple: ' +
        row.GradeLevel + ' / ' + row.Subject + ' / ' + row.Term + '.'
      );
    }
  });

  Object.keys(BOW_MAPEH_IMPORT_EXPECTED_DOMAIN_COUNTS_).forEach(function (domain) {
    var expectedCount = BOW_MAPEH_IMPORT_EXPECTED_DOMAIN_COUNTS_[domain];
    var actualCount = domainCounts[domain] || 0;
    if (actualCount !== expectedCount) {
      errors.push(
        domain + ' expected ' + expectedCount +
        ' row(s), found ' + actualCount + '.'
      );
    }
  });

  Object.keys(domainCounts).forEach(function (domain) {
    if (!BOW_MAPEH_IMPORT_EXPECTED_DOMAIN_COUNTS_.hasOwnProperty(domain)) {
      errors.push('Unexpected MAPEH Domain: ' + domain + '.');
    }
  });

  Object.keys(BOW_MAPEH_IMPORT_EXPECTED_TERM_COUNTS_).forEach(function (term) {
    var expectedCount = BOW_MAPEH_IMPORT_EXPECTED_TERM_COUNTS_[term];
    var actualCount = termCounts[term] || 0;
    if (actualCount !== expectedCount) {
      errors.push(
        term + ' expected ' + expectedCount +
        ' row(s), found ' + actualCount + '.'
      );
    }
  });

  Object.keys(termCounts).forEach(function (term) {
    if (!BOW_MAPEH_IMPORT_EXPECTED_TERM_COUNTS_.hasOwnProperty(term)) {
      errors.push('Unexpected MAPEH Term: ' + term + '.');
    }
  });
}

function validateMapehRowsAgainstLiveData_(spreadsheet, sourceRows, errors) {
  var bowSheet = spreadsheet.getSheetByName(SHEET_NAMES.BOW_DATABASE);
  if (!bowSheet) {
    errors.push('Missing live sheet: ' + SHEET_NAMES.BOW_DATABASE + '.');
    return;
  }

  try {
    assertRequiredHeaders_(bowSheet, BOW_HEADERS, SHEET_NAMES.BOW_DATABASE);
  } catch (err) {
    errors.push(err.message);
    return;
  }

  var auditSheet = spreadsheet.getSheetByName(BOW_MATH_IMPORT_AUDIT_SHEET_);
  if (!auditSheet) {
    errors.push('Missing required audit sheet: ' + BOW_MATH_IMPORT_AUDIT_SHEET_ + '.');
    return;
  }
  try {
    assertExactSheetHeaders_(
      auditSheet,
      BOW_MATH_IMPORT_AUDIT_HEADERS_,
      BOW_MATH_IMPORT_AUDIT_SHEET_
    );
  } catch (err) {
    errors.push(err.message);
    return;
  }

  var existingBowIds = {};
  getSheetObjects_(bowSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      existingBowIds[key] = true;
    }
  });

  var auditedIds = {};
  getSheetObjects_(auditSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      auditedIds[key] = true;
    }
  });

  sourceRows.forEach(function (row) {
    var bowId = String(row.BOW_ID || '').trim();
    var key = normalizeForMatch_(bowId);
    if (existingBowIds[key]) {
      errors.push(
        'Incoming MAPEH BOW_ID already exists in BOW_DATABASE: ' + bowId + '.'
      );
    }
    if (auditedIds[key]) {
      errors.push(
        'Incoming MAPEH BOW_ID already exists in BOW_DATABASE_AUDIT: ' + bowId + '.'
      );
    }
  });
}

function validateMapehTuplesInactive_(rows, errors) {
  var checked = {};

  rows.forEach(function (row) {
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    if (checked[key]) {
      return;
    }
    checked[key] = true;

    var support = getSupportStatus_(row);
    if (support.supported) {
      errors.push(
        'MAPEH review tuple is already processable and must remain inactive: ' +
        row.GradeLevel + ' / ' + row.Subject + ' / ' + row.Term + '.'
      );
    }
  });
}

function createMapehBowImportReport_(errors, sourceRows, sourceRowCount) {
  var valid = errors.length === 0;
  var tuples = {};
  var domainCounts = {};
  var termCounts = {};

  (sourceRows || []).forEach(function (row) {
    tuples[supportMatrixKey_(row.GradeLevel, row.Subject, row.Term)] = true;

    var domain = String(row.Domain || '').trim();
    if (domain) {
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    }

    var term = String(row.Term || '').trim();
    if (term) {
      termCounts[term] = (termCounts[term] || 0) + 1;
    }
  });

  var domainLine = Object.keys(BOW_MAPEH_IMPORT_EXPECTED_DOMAIN_COUNTS_)
    .map(function (domain) {
      return domain + ' ' + (domainCounts[domain] || 0) +
        ' / ' + BOW_MAPEH_IMPORT_EXPECTED_DOMAIN_COUNTS_[domain];
    })
    .join(', ');
  var termLine = Object.keys(BOW_MAPEH_IMPORT_EXPECTED_TERM_COUNTS_)
    .map(function (term) {
      return term + ' ' + (termCounts[term] || 0) +
        ' / ' + BOW_MAPEH_IMPORT_EXPECTED_TERM_COUNTS_[term];
    })
    .join(', ');

  var lines = [
    valid
      ? 'MAPEH BOW import dry run passed.'
      : 'MAPEH BOW import dry run failed.',
    'Source rows: ' + sourceRowCount +
      ' / ' + BOW_MAPEH_IMPORT_EXPECTED_SOURCE_ROWS_,
    'Detected grade/subject/term tuples: ' + Object.keys(tuples).length +
      ' / ' + BOW_MAPEH_IMPORT_EXPECTED_TUPLES_,
    'Domain rows: ' + domainLine,
    'Term rows: ' + termLine,
    'MAPEH review rows eligible to append: ' + (valid ? sourceRows.length : 0),
    'Validation errors: ' + errors.length
  ];

  if (errors.length) {
    lines.push('', errors.slice(0, 20).join('\n'));
    if (errors.length > 20) {
      lines.push('Additional errors omitted: ' + (errors.length - 20) + '.');
    }
  }

  return {
    valid: valid,
    errors: errors,
    sourceRows: sourceRowCount,
    sourceData: sourceRows,
    text: lines.join('\n')
  };
}

function assertMapehBowCommitReadiness_(report) {
  if (!report || !report.valid) {
    throw new Error(
      'MAPEH BOW import dry run failed:\n' +
      ((report && report.errors) || ['No dry-run report was returned.']).join('\n')
    );
  }

  var sourceRows = report.sourceData || [];
  var errors = [];
  if (sourceRows.length !== BOW_MAPEH_IMPORT_EXPECTED_SOURCE_ROWS_) {
    errors.push(
      'Commit requires exactly ' + BOW_MAPEH_IMPORT_EXPECTED_SOURCE_ROWS_ +
      ' eligible rows, found ' + sourceRows.length + '.'
    );
  }
  validateMapehExpectedCounts_(sourceRows, errors);

  if (errors.length) {
    throw new Error(
      'MAPEH commit readiness validation failed:\n' +
      errors.join('\n')
    );
  }
}

function appendMapehBowImportRows_(bowSheet, sourceRows) {
  var headerMap = getHeaderMap_(bowSheet);
  var lastColumn = bowSheet.getLastColumn();
  var values = sourceRows.map(function (sourceRow) {
    var row = new Array(lastColumn).fill('');
    BOW_HEADERS.forEach(function (header) {
      var value = header === 'Notes'
        ? sourceRow.ExtractionNotes
        : sourceRow[header];
      if (header === 'WeekNumber') {
        row[headerMap[header] - 1] = normalizeMapehComparableText_(value);
      } else if (header === 'SourcePage') {
        row[headerMap[header] - 1] = normalizeMapehComparableText_(value);
      } else {
        row[headerMap[header] - 1] = value;
      }
    });
    if (headerMap.SourcePage) {
      row[headerMap.SourcePage - 1] =
        normalizeMapehComparableText_(sourceRow.SourcePage);
    }
    return row;
  });

  if (values.length) {
    var startRow = bowSheet.getLastRow() + 1;
    if (headerMap.WeekNumber) {
      bowSheet.getRange(startRow, headerMap.WeekNumber, values.length, 1)
        .setNumberFormat('@');
    }
    if (headerMap.SourcePage) {
      bowSheet.getRange(startRow, headerMap.SourcePage, values.length, 1)
        .setNumberFormat('@');
    }
    bowSheet.getRange(
      startRow,
      1,
      values.length,
      lastColumn
    ).setValues(values);
  }
}

function appendMapehBowAuditRows_(auditSheet, sourceRows, importBatch) {
  var importedAt = now_();
  var values = sourceRows.map(function (row) {
    return [
      row.BOW_ID,
      row.SourceFile,
      normalizeMapehComparableText_(row.SourcePage),
      row.ExtractionNotes,
      importBatch,
      importedAt
    ];
  });

  if (values.length) {
    var startRow = auditSheet.getLastRow() + 1;
    auditSheet.getRange(startRow, 3, values.length, 1).setNumberFormat('@');
    auditSheet.getRange(
      startRow,
      1,
      values.length,
      values[0].length
    ).setValues(values);
  }
}

function normalizeMapehComparableText_(value) {
  if (value === null || typeof value === 'undefined') {
    return '';
  }
  return String(value).replace(/\s+/g, ' ').trim();
}

function normalizeMapehCommittedField_(fieldName, value) {
  if (fieldName === 'WeekNumber' || fieldName === 'SourcePage') {
    return normalizeMapehComparableText_(value);
  }
  return normalizeImportCell_(value);
}

function captureMapehBowImportState_(spreadsheet, bowSheet, auditSheet) {
  var state = captureEnglishBowImportState_(spreadsheet, bowSheet, auditSheet);
  state.pacingChecksum = checksumSheetData_(
    requireExistingSheet_(spreadsheet, SHEET_NAMES.BOW_PACING_METADATA)
  );
  return state;
}

function validateCommittedMapehBowImport_(context) {
  var errors = [];
  var sourceRows = context.sourceRows;
  var before = context.beforeState;
  var bowRowCountAfter = Math.max(context.bowSheet.getLastRow() - 1, 0);
  var auditRowCountAfter = Math.max(context.auditSheet.getLastRow() - 1, 0);

  if (bowRowCountAfter - before.bowRowCount !== sourceRows.length) {
    errors.push(
      'BOW_DATABASE row count changed by ' +
      (bowRowCountAfter - before.bowRowCount) +
      ', expected ' + sourceRows.length + '.'
    );
  }
  if (auditRowCountAfter - before.auditRowCount !== sourceRows.length) {
    errors.push(
      'BOW_DATABASE_AUDIT row count changed by ' +
      (auditRowCountAfter - before.auditRowCount) +
      ', expected ' + sourceRows.length + '.'
    );
  }

  var existingBowChecksumAfter = checksumValues_(
    context.bowSheet.getRange(
      1,
      1,
      before.bowRegionRows,
      before.bowRegionColumns
    ).getValues()
  );
  if (existingBowChecksumAfter !== before.bowChecksum) {
    errors.push('Pre-existing BOW_DATABASE rows changed during MAPEH import.');
  }

  var existingAuditChecksumAfter = checksumValues_(
    context.auditSheet.getRange(
      1,
      1,
      before.auditRegionRows,
      before.auditRegionColumns
    ).getValues()
  );
  if (existingAuditChecksumAfter !== before.auditChecksum) {
    errors.push('Pre-existing BOW_DATABASE_AUDIT rows changed during MAPEH import.');
  }

  validateMapehCommittedBowRows_(
    context.bowSheet,
    sourceRows,
    errors
  );
  validateMapehCommittedAuditRows_(
    context.auditSheet,
    sourceRows,
    context.importBatch,
    errors
  );
  validateMapehExpectedCounts_(sourceRows, errors);

  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.BOW_PACING_METADATA)
    ) !== before.pacingChecksum
  ) {
    errors.push('BOW_PACING_METADATA changed during MAPEH import.');
  }
  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUPPORT_MATRIX)
    ) !== before.supportChecksum
  ) {
    errors.push('SUPPORT_MATRIX changed during MAPEH import.');
  }
  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUBJECT_PROFILES)
    ) !== before.profileChecksum
  ) {
    errors.push('SUBJECT_PROFILES changed during MAPEH import.');
  }

  validateMapehTuplesInactive_(sourceRows, errors);
  return createMapehCommitValidationReport_(
    errors,
    sourceRows.length
  );
}

function validateMapehCommittedBowRows_(bowSheet, sourceRows, errors) {
  var liveById = {};
  getSheetObjects_(bowSheet).forEach(function (row) {
    var key = normalizeForMatch_(row.BOW_ID);
    if (key) {
      liveById[key] = liveById[key] || [];
      liveById[key].push(row);
    }
  });

  sourceRows.forEach(function (sourceRow) {
    var matches = liveById[normalizeForMatch_(sourceRow.BOW_ID)] || [];
    if (matches.length !== 1) {
      errors.push(
        'Expected exactly one imported BOW_DATABASE row for ' +
        sourceRow.BOW_ID + ', found ' + matches.length + '.'
      );
      return;
    }

    var liveRow = matches[0];
    BOW_HEADERS.forEach(function (header) {
      var expected = header === 'Notes'
        ? sourceRow.ExtractionNotes
        : sourceRow[header];
      if (
        normalizeMapehCommittedField_(header, liveRow[header]) !==
        normalizeMapehCommittedField_(header, expected)
      ) {
        errors.push(
          sourceRow.BOW_ID +
          ' does not match staging field ' + header + '.'
        );
      }
    });
  });
}

function validateMapehCommittedAuditRows_(
  auditSheet,
  sourceRows,
  importBatch,
  errors
) {
  var batchRows = [];
  var auditMatches = {};
  getSheetObjects_(auditSheet).forEach(function (row) {
    if (String(row.ImportBatch || '') !== importBatch) {
      return;
    }
    batchRows.push(row);
    var key = normalizeForMatch_(row.BOW_ID);
    auditMatches[key] = auditMatches[key] || [];
    auditMatches[key].push(row);
  });

  sourceRows.forEach(function (sourceRow) {
    var matches = auditMatches[normalizeForMatch_(sourceRow.BOW_ID)] || [];
    if (matches.length !== 1) {
      errors.push(
        'Expected exactly one audit row for ' +
        sourceRow.BOW_ID + ' in batch ' + importBatch +
        ', found ' + matches.length + '.'
      );
      return;
    }

    var auditRow = matches[0];
    ['SourceFile', 'SourcePage', 'ExtractionNotes'].forEach(function (header) {
      if (
        normalizeMapehCommittedField_(header, auditRow[header]) !==
        normalizeMapehCommittedField_(header, sourceRow[header])
      ) {
        errors.push(
          sourceRow.BOW_ID +
          ' audit field does not match staging: ' + header + '.'
        );
      }
    });
    if (String(auditRow.ImportBatch || '') !== importBatch) {
      errors.push(sourceRow.BOW_ID + ' has an incorrect ImportBatch value.');
    }
    if (!auditRow.ImportedAt) {
      errors.push(sourceRow.BOW_ID + ' has a blank ImportedAt value.');
    }
  });

  if (batchRows.length !== sourceRows.length) {
    errors.push(
      'Audit batch ' + importBatch +
      ' contains ' + batchRows.length +
      ' row(s), expected ' + sourceRows.length + '.'
    );
  }
}

function rollbackMapehBowImport_(context) {
  var errors = [];
  var bowRestored = false;
  var auditRestored = false;

  try {
    restoreSheetFromImportBackup_(context.bowSheet, context.bowBackup);
    bowRestored = true;
  } catch (err) {
    errors.push(
      'BOW_DATABASE restore failed: ' +
      (err && err.message ? err.message : String(err))
    );
  }

  try {
    restoreSheetFromImportBackup_(context.auditSheet, context.auditBackup);
    auditRestored = true;
  } catch (err) {
    errors.push(
      'BOW_DATABASE_AUDIT restore failed: ' +
      (err && err.message ? err.message : String(err))
    );
  }

  try {
    SpreadsheetApp.flush();
  } catch (err) {
    errors.push(
      'Rollback flush failed: ' +
      (err && err.message ? err.message : String(err))
    );
  }

  if (bowRestored) {
    var bowRowCount = Math.max(context.bowSheet.getLastRow() - 1, 0);
    if (
      bowRowCount !== context.beforeState.bowRowCount ||
      checksumSheetData_(context.bowSheet) !== context.beforeState.bowChecksum
    ) {
      errors.push('BOW_DATABASE rollback verification failed.');
      bowRestored = false;
    }
  }
  if (auditRestored) {
    var auditRowCount = Math.max(context.auditSheet.getLastRow() - 1, 0);
    if (
      auditRowCount !== context.beforeState.auditRowCount ||
      checksumSheetData_(context.auditSheet) !== context.beforeState.auditChecksum
    ) {
      errors.push('BOW_DATABASE_AUDIT rollback verification failed.');
      auditRestored = false;
    }
  }

  var valid = bowRestored && auditRestored && errors.length === 0;
  var lines = [
    'BOW_DATABASE: ' + (bowRestored ? 'restored and verified' : 'NOT fully restored'),
    'BOW_DATABASE_AUDIT: ' +
      (auditRestored ? 'restored and verified' : 'NOT fully restored'),
    'Rollback complete: ' + (valid ? 'Yes' : 'No')
  ];
  if (errors.length) {
    lines.push('Rollback errors: ' + errors.join(' | '));
  }
  return {
    valid: valid,
    errors: errors,
    text: lines.join('; ')
  };
}

function createMapehCommitValidationReport_(errors, importedRows) {
  var valid = errors.length === 0;
  var lines = [
    valid
      ? 'MAPEH BOW post-import validation passed.'
      : 'MAPEH BOW post-import validation failed.',
    'Imported review-only rows: ' + importedRows,
    'Validated grade/subject/term tuples: ' + BOW_MAPEH_IMPORT_EXPECTED_TUPLES_,
    'BOW_PACING_METADATA changes: 0',
    'SUPPORT_MATRIX activation changes: 0',
    'SUBJECT_PROFILES changes: 0',
    'Validation errors: ' + errors.length
  ];
  if (errors.length) {
    lines.push('', errors.slice(0, 20).join('\n'));
    if (errors.length > 20) {
      lines.push('Additional errors omitted: ' + (errors.length - 20) + '.');
    }
  }
  return {
    valid: valid,
    errors: errors,
    text: lines.join('\n')
  };
}

function termNumberMapehBow_(term) {
  var map = {
    'First Term': 1,
    'Second Term': 2,
    'Third Term': 3
  };
  return map[String(term || '').trim()] || 0;
}
