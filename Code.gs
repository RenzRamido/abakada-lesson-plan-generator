/**
 * Main entry points. New submissions are queued only; generation happens in
 * processGenerationQueue so Apps Script executions can resume safely.
 */

function onFormSubmit(e) {
  if (!e || !e.range) {
    throw new Error('onFormSubmit must be run from a spreadsheet form-submit trigger.');
  }

  try {
    var authorization = authorizeSubmissionRowOrBlock_(e.range.getSheet(), e.range.getRow());
    if (!authorization.authorized) {
      return;
    }
    enqueueSubmissionFromRow_(e.range.getRow(), e.range.getSheet().getName());
  } catch (err) {
    var sheet = getResponseSheet_(e.range.getSheet().getName());
    var rowNumber = e.range.getRow();
    var rowData = rowNumber > 1 ? getRowData_(sheet, rowNumber) : {};
    var submissionId = rowData.SubmissionID || makeSubmissionId_(rowNumber);
    var jobId = rowData.JobID || makeJobId_(submissionId);
    var message = err && err.message ? err.message : String(err);

    writeOutputFields_(sheet, rowNumber, {
      SubmissionID: submissionId,
      JobID: jobId,
      ProcessingStatus: STATUS.FAILED,
      ErrorMessage: truncate_(message, 45000),
      LastUpdatedAt: now_()
    });
    logProcessing_(submissionId, jobId, STATUS.FAILED, message, err && err.stack ? err.stack : '');
    sendAdminFailureEmail_({
      JobID: jobId,
      SubmissionID: submissionId,
      TeacherEmail: rowData.TeacherEmail || '',
      GradeLevel: rowData.GradeLevel || '',
      Subject: rowData.Subject || '',
      Term: rowData.Term || '',
      CurrentDay: rowData.CurrentDay || '',
      CurrentPhase: 'Form submit enqueue',
      LastError: message
    });
    throw err;
  }
}

function processSubmission(rowNumber, sheetName) {
  return enqueueSubmissionFromRow_(rowNumber, sheetName);
}

function processSelectedRow() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rowNumber = sheet.getActiveRange().getRow();
  if (rowNumber <= 1) {
    SpreadsheetApp.getUi().alert('Select a response row, not the header row.');
    return;
  }

  var job = processSubmission(rowNumber, sheet.getName());
  SpreadsheetApp.getUi().alert('Row queued or updated. Status: ' + job.Status + '\nJobID: ' + job.JobID);
}

function processLatestUnprocessedRow() {
  var sheet = getResponseSheet_();
  var values = sheet.getDataRange().getValues();
  var headers = getHeaderMap_(sheet);
  var statusIndex = headers.ProcessingStatus;

  for (var r = values.length; r >= 2; r--) {
    var status = statusIndex ? String(values[r - 1][statusIndex - 1] || '').trim() : '';
    if (!status || status === 'New' || status === STATUS.FAILED || status === 'Error') {
      processSubmission(r, sheet.getName());
      SpreadsheetApp.getUi().alert('Queued row ' + r + '.');
      return;
    }
  }

  SpreadsheetApp.getUi().alert('No unprocessed response row found.');
}

function validateRequiredFields_(rowData) {
  var required = [
    'TeacherName',
    'TeacherEmail',
    'SchoolName',
    'GradeLevel',
    'Subject',
    'Term',
    'ClassLearningAbility',
    'PreferredLanguage'
  ];

  var missing = [];
  required.forEach(function (name) {
    if (!String(rowData[name] || '').trim()) {
      missing.push(name);
    }
  });

  if (missing.length) {
    throw new Error('Missing required field(s): ' + missing.join(', '));
  }
}

function normalizeSubmissionData_(rowData) {
  applyFormFieldAliases_(rowData);

  rowData.TeacherName = String(rowData.TeacherName || '').trim();
  rowData.TeacherEmail = String(rowData.TeacherEmail || '').trim();
  rowData.SchoolName = String(rowData.SchoolName || '').trim();
  rowData.GradeLevel = normalizeGradeLevel_(rowData.GradeLevel);
  rowData.Subject = normalizeSubject_(rowData.Subject);
  rowData.Term = normalizeTerm_(rowData.Term);
  rowData.ClassLearningAbility = String(rowData.ClassLearningAbility || '').trim();
  rowData.LearnerContext = String(rowData.LearnerContext || '').trim();
  rowData.AvailableMaterials = String(rowData.AvailableMaterials || '').trim();
  rowData.PreferredTeachingStrategy = String(rowData.PreferredTeachingStrategy || '').trim();
  rowData.SpecialInstructions = String(rowData.SpecialInstructions || '').trim();
  rowData.PreferredLanguage = normalizePreferredLanguage_(rowData.PreferredLanguage);
  rowData.SchoolYear = String(rowData.SchoolYear || '').trim() || 'Not specified';
  rowData.ClassSection = String(rowData.ClassSection || '').trim() || 'Not specified';
  rowData.DailyTimeAllotment = String(rowData.DailyTimeAllotment || '').trim();

  return rowData;
}

function normalizeGradeLevel_(value) {
  var text = String(value || '').trim();
  var match = text.match(/\d+/);
  return match ? 'Grade ' + Number(match[0]) : text;
}

function normalizeSubject_(value) {
  var text = String(value || '').trim();
  if (normalizeForMatch_(text) === 'math') {
    return 'Mathematics';
  }
  return text;
}

function normalizePreferredLanguage_(value) {
  var text = String(value || '').trim();
  var normalized = normalizeForMatch_(text);
  if (!normalized) {
    return 'English';
  }
  if (
    normalized === 'filipino' ||
    normalized === 'tagalog' ||
    normalized === 'filipino only' ||
    normalized === 'tagalog only'
  ) {
    return 'Filipino';
  }
  if (
    normalized === 'bilingual' ||
    normalized === 'both' ||
    normalized === 'english and filipino' ||
    normalized === 'filipino and english' ||
    normalized === 'english & filipino' ||
    normalized === 'filipino & english' ||
    normalized === 'english/filipino' ||
    normalized === 'filipino/english' ||
    normalized === 'english-filipino' ||
    normalized === 'filipino-english'
  ) {
    return 'Bilingual';
  }
  if (normalized === 'english' || normalized === 'english only') {
    return 'English';
  }
  return 'English';
}

function writeOutputFields_(sheet, rowNumber, data) {
  var headers = getHeaderMap_(sheet);
  Object.keys(data).forEach(function (key) {
    writeCell_(sheet, rowNumber, headers, key, data[key]);
  });
}

function updateProcessingStatus_(sheet, rowNumber, status, errorMessage) {
  writeOutputFields_(sheet, rowNumber, {
    ProcessingStatus: status,
    ErrorMessage: errorMessage || '',
    LastUpdatedAt: now_()
  });
}

function getResponseSheet_(sheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (sheetName) {
    var namedSheet = spreadsheet.getSheetByName(sheetName);
    if (namedSheet) {
      return namedSheet;
    }
  }

  return spreadsheet.getSheetByName(SHEET_NAMES.FORM_RESPONSES) || ensureResponseSheet_();
}

function getRowData_(sheet, rowNumber) {
  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  var values = sheet.getRange(rowNumber, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  var rowData = {};

  headers.forEach(function (header, index) {
    if (header) {
      rowData[String(header).trim()] = values[index];
    }
  });

  applyFormFieldAliases_(rowData);
  return rowData;
}

function applyFormFieldAliases_(rowData) {
  Object.keys(FORM_FIELD_ALIASES).forEach(function (canonicalName) {
    if (String(rowData[canonicalName] || '').trim()) {
      return;
    }

    var aliasValue = '';
    FORM_FIELD_ALIASES[canonicalName].some(function (alias) {
      var trimmedAlias = String(alias).trim();
      if (String(rowData[trimmedAlias] || '').trim()) {
        aliasValue = rowData[trimmedAlias];
        return true;
      }
      return false;
    });

    if (String(aliasValue || '').trim()) {
      rowData[canonicalName] = aliasValue;
    }
  });
}

function getHeaderMap_(sheet) {
  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  var map = {};

  headers.forEach(function (header, index) {
    if (header) {
      map[String(header).trim()] = index + 1;
    }
  });

  return map;
}

function writeCell_(sheet, rowNumber, headers, columnName, value) {
  if (!headers[columnName]) {
    appendMissingHeaders_(sheet, [columnName]);
    headers = getHeaderMap_(sheet);
  }

  sheet.getRange(rowNumber, headers[columnName]).setValue(value);
}

function makeSubmissionId_(rowNumber) {
  var datePart = Utilities.formatDate(now_(), Session.getScriptTimeZone(), 'yyyyMMddHHmmss');
  return 'LPG-' + datePart + '-R' + rowNumber;
}

function makeJobId_(submissionId) {
  var randomPart = Utilities.getUuid().split('-')[0].toUpperCase();
  return 'JOB-' + submissionId + '-' + randomPart;
}

function rowFromValues_(values, headers) {
  var row = {};
  Object.keys(headers).forEach(function (key) {
    row[key] = values[headers[key] - 1];
  });
  applyFormFieldAliases_(row);
  return row;
}

function duplicateKey_(row) {
  return [
    normalizeForMatch_(row.TeacherEmail),
    normalizeForMatch_(row.SchoolYear || 'Not specified'),
    normalizeForMatch_(row.GradeLevel),
    normalizeForMatch_(row.ClassSection || 'Not specified'),
    normalizeForMatch_(row.Subject),
    normalizeForMatch_(row.Term)
  ].join('|');
}

function appendGeneratedHistory_(job) {
  var sheet = getSheetByName_(SHEET_NAMES.GENERATED_HISTORY);
  appendMissingHeaders_(sheet, GENERATED_HISTORY_HEADERS);

  appendObjectRow_(sheet, GENERATED_HISTORY_HEADERS, {
    Timestamp: now_(),
    JobID: job.JobID || '',
    SubmissionID: job.SubmissionID || '',
    TeacherEmail: job.TeacherEmail || '',
    TeacherName: job.TeacherName || '',
    SchoolName: job.SchoolName || '',
    SchoolYear: job.SchoolYear || '',
    GradeLevel: job.GradeLevel || '',
    ClassSection: job.ClassSection || '',
    Subject: job.Subject || '',
    Term: job.Term || '',
    TotalTeachingDays: job.TotalTeachingDays || '',
    GeneratedDocLink: job.GeneratedDocLink || '',
    CompletedAt: job.CompletedAt || now_(),
    DuplicateWarning: job.DuplicateWarning || ''
  });
}

function hasGeneratedHistoryForJob_(jobId) {
  if (!jobId) {
    return false;
  }

  var sheet = getSheetByName_(SHEET_NAMES.GENERATED_HISTORY);
  appendMissingHeaders_(sheet, GENERATED_HISTORY_HEADERS);
  var rowNumber = findRowNumberByColumnValue_(sheet, 'JobID', jobId);
  return !!rowNumber;
}

function notifyAdminOfError_(submissionId, message) {
  sendAdminFailureEmail_({
    SubmissionID: submissionId,
    JobID: '',
    LastError: message,
    CurrentPhase: 'Legacy error notice'
  });
}
