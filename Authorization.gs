var AUTHORIZATION_CONFIG_LOG_STATUS_ = 'AuthorizationConfigUnavailable';

function normalizeAuthorizedEmail_(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidAuthorizedEmail_(email) {
  var normalized = normalizeAuthorizedEmail_(email);
  var parts = normalized.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return false;
  }

  var localPart = parts[0];
  if (
    localPart.charAt(0) === '.' ||
    localPart.charAt(localPart.length - 1) === '.' ||
    localPart.indexOf('..') !== -1 ||
    localPart.indexOf('*') !== -1 ||
    /\s/.test(localPart) ||
    !/^[a-z0-9.!#$%&'+\/=?^_`{|}~-]+$/i.test(localPart)
  ) {
    return false;
  }

  var domainLabels = parts[1].split('.');
  if (domainLabels.length < 2) {
    return false;
  }

  for (var i = 0; i < domainLabels.length; i++) {
    var label = domainLabels[i];
    if (
      !label ||
      label.charAt(0) === '-' ||
      label.charAt(label.length - 1) === '-' ||
      !/^[a-z0-9-]+$/i.test(label)
    ) {
      return false;
    }
  }

  return true;
}

function inspectAuthorizedEmailConfiguration_() {
  var result = {
    sheetExists: false,
    headerValid: false,
    count: 0,
    emailSet: {},
    invalidRows: [],
    duplicateRows: [],
    unexpectedColumnRows: [],
    readError: ''
  };

  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(SHEET_NAMES.AUTHORIZED_EMAILS);
    if (!sheet) {
      return result;
    }

    result.sheetExists = true;
    var lastRow = Math.max(sheet.getLastRow(), 1);
    var lastColumn = Math.max(sheet.getLastColumn(), 1);
    var values = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
    result.headerValid = String(values[0][0] || '') === AUTHORIZED_EMAILS_HEADERS[0];

    var unexpectedRows = {};
    for (var r = 0; r < values.length; r++) {
      for (var c = 1; c < values[r].length; c++) {
        if (String(values[r][c] || '').trim()) {
          unexpectedRows[r + 1] = true;
        }
      }
    }
    result.unexpectedColumnRows = Object.keys(unexpectedRows).map(Number).sort(function (a, b) {
      return a - b;
    });

    var firstRowsByEmail = {};
    var duplicateRows = {};
    for (var rowIndex = 1; rowIndex < values.length; rowIndex++) {
      var rawValue = values[rowIndex][0];
      var normalized = normalizeAuthorizedEmail_(rawValue);
      if (!normalized) {
        continue;
      }
      if (!isValidAuthorizedEmail_(normalized)) {
        result.invalidRows.push(rowIndex + 1);
        continue;
      }
      if (firstRowsByEmail[normalized]) {
        duplicateRows[firstRowsByEmail[normalized]] = true;
        duplicateRows[rowIndex + 1] = true;
        continue;
      }
      firstRowsByEmail[normalized] = rowIndex + 1;
      result.emailSet[normalized] = true;
      result.count += 1;
    }
    result.duplicateRows = Object.keys(duplicateRows).map(Number).sort(function (a, b) {
      return a - b;
    });
  } catch (err) {
    result.readError = err && err.message ? err.message : String(err);
  }

  return result;
}

function loadAuthorizedEmailSet_() {
  var inspection = inspectAuthorizedEmailConfiguration_();
  var problems = [];

  if (inspection.readError) {
    problems.push('AUTHORIZED_EMAILS could not be read.');
  }
  if (!inspection.sheetExists) {
    problems.push('AUTHORIZED_EMAILS is missing.');
  } else if (!inspection.headerValid) {
    problems.push('AUTHORIZED_EMAILS must have exactly Email in cell A1.');
  }
  if (inspection.unexpectedColumnRows.length) {
    problems.push('AUTHORIZED_EMAILS contains populated cells outside column A.');
  }
  if (inspection.invalidRows.length) {
    problems.push('AUTHORIZED_EMAILS contains invalid nonblank entries.');
  }
  if (inspection.duplicateRows.length) {
    problems.push('AUTHORIZED_EMAILS contains duplicate normalized entries.');
  }
  if (!inspection.count) {
    problems.push('AUTHORIZED_EMAILS contains no valid authorized addresses.');
  }

  if (problems.length) {
    var error = new Error(problems.join(' '));
    error.authorizationConfigurationError = true;
    throw error;
  }

  return {
    emailSet: inspection.emailSet,
    count: inspection.count
  };
}

function assertAuthorizedEmailConfiguration_() {
  return loadAuthorizedEmailSet_();
}

function evaluateAuthorizedEmail_(email) {
  var configuration;
  try {
    configuration = assertAuthorizedEmailConfiguration_();
  } catch (err) {
    return {
      authorized: false,
      configurationUnavailable: true,
      permanentBlock: false,
      formStatus: STATUS.BLOCKED,
      reasonCode: 'AUTH_CONFIG_INVALID',
      message: 'Authorization configuration is unavailable or invalid.'
    };
  }

  var normalized = normalizeAuthorizedEmail_(email);
  if (!normalized || !isValidAuthorizedEmail_(normalized)) {
    return {
      authorized: false,
      configurationUnavailable: false,
      permanentBlock: true,
      formStatus: STATUS.UNAUTHORIZED,
      reasonCode: 'REQUESTER_EMAIL_INVALID',
      message: 'Requester email is not authorized.'
    };
  }

  if (!configuration.emailSet[normalized]) {
    return {
      authorized: false,
      configurationUnavailable: false,
      permanentBlock: true,
      formStatus: STATUS.UNAUTHORIZED,
      reasonCode: 'REQUESTER_EMAIL_NOT_ALLOWED',
      message: 'Requester email is not authorized.'
    };
  }

  return {
    authorized: true,
    configurationUnavailable: false,
    permanentBlock: false,
    formStatus: '',
    reasonCode: 'AUTHORIZED',
    message: ''
  };
}

function authorizeSubmissionRowOrBlock_(sheet, rowNumber) {
  try {
    var rowData = normalizeSubmissionData_(getRowData_(sheet, rowNumber));
    var decision = evaluateAuthorizedEmail_(rowData.TeacherEmail);
    if (decision.authorized) {
      return { authorized: true, decision: decision, rowData: rowData };
    }

    var submissionId = String(rowData.SubmissionID || '').trim() || makeSubmissionId_(rowNumber);
    var existingJobId = String(rowData.JobID || '').trim();
    var errorMessage = decision.configurationUnavailable
      ? 'Authorization configuration is unavailable or invalid. No generation job was created.'
      : 'Requester email is not authorized. No generation job was created.';
    var alreadyRecorded = String(rowData.ProcessingStatus || '').trim() === decision.formStatus &&
      String(rowData.ErrorMessage || '').trim() === errorMessage;

    writeOutputFields_(sheet, rowNumber, {
      SubmissionID: submissionId,
      JobID: existingJobId,
      ProcessingStatus: decision.formStatus,
      QueuePosition: '',
      ErrorMessage: errorMessage,
      LastUpdatedAt: now_()
    });

    if (!alreadyRecorded) {
      logProcessing_(
        submissionId,
        existingJobId,
        decision.formStatus,
        decision.configurationUnavailable
          ? 'Submission blocked because authorized-email configuration was unavailable or invalid; no queue row or outbound email was created.'
          : 'Submission blocked by the authorized-email gate; no queue row or outbound email was created.',
        ''
      );
    }

    return {
      authorized: false,
      decision: decision,
      rowData: rowData,
      SubmissionID: submissionId,
      JobID: existingJobId,
      Status: decision.formStatus
    };
  } catch (err) {
    Logger.log('Submission authorization gate failed closed before queue creation. No outbound email was sent.');
    return {
      authorized: false,
      decision: {
        authorized: false,
        configurationUnavailable: true,
        permanentBlock: false,
        formStatus: STATUS.BLOCKED,
        reasonCode: 'AUTH_GATE_ERROR',
        message: 'Authorization configuration is unavailable or invalid.'
      },
      SubmissionID: '',
      JobID: '',
      Status: STATUS.BLOCKED
    };
  }
}

function evaluateQueueJobAuthorization_(job) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var responseSheet = spreadsheet.getSheetByName(SHEET_NAMES.FORM_RESPONSES);
  var rowNumber = Number(job && job.FormResponseRow || 0);

  if (!responseSheet || !Number.isInteger(rowNumber) || rowNumber <= 1 || rowNumber > responseSheet.getLastRow()) {
    return createQueueAuthorizationBlockDecision_(
      'QUEUE_SOURCE_ROW_INVALID',
      'Queue job is not linked to a valid authoritative Form response.',
      false,
      0,
      STATUS.BLOCKED
    );
  }

  var formRow = normalizeSubmissionData_(getRowData_(responseSheet, rowNumber));
  var queueSubmissionId = String(job.SubmissionID || '').trim();
  var formSubmissionId = String(formRow.SubmissionID || '').trim();
  var queueJobId = String(job.JobID || '').trim();
  var formJobId = String(formRow.JobID || '').trim();

  if (!queueSubmissionId || !formSubmissionId || queueSubmissionId !== formSubmissionId ||
      !queueJobId || !formJobId || queueJobId !== formJobId) {
    return createQueueAuthorizationBlockDecision_(
      'QUEUE_SOURCE_IDENTITY_MISMATCH',
      'Queue job identity does not match its authoritative Form response.',
      false,
      0,
      STATUS.BLOCKED
    );
  }

  var queueEmail = normalizeAuthorizedEmail_(job.TeacherEmail);
  var formEmail = normalizeAuthorizedEmail_(formRow.TeacherEmail);
  if (!isValidAuthorizedEmail_(formEmail)) {
    return createQueueAuthorizationBlockDecision_(
      'REQUESTER_EMAIL_INVALID',
      'Requester email is not authorized.',
      true,
      rowNumber,
      STATUS.UNAUTHORIZED
    );
  }

  if (!queueEmail || queueEmail !== formEmail) {
    return createQueueAuthorizationBlockDecision_(
      'QUEUE_SOURCE_EMAIL_MISMATCH',
      'Queue requester identity does not match its authoritative Form response.',
      true,
      rowNumber,
      STATUS.BLOCKED
    );
  }

  var emailDecision = evaluateAuthorizedEmail_(formEmail);
  emailDecision.sourceRowVerified = true;
  emailDecision.formRowNumber = rowNumber;
  emailDecision.formRow = formRow;
  return emailDecision;
}

function createQueueAuthorizationBlockDecision_(reasonCode, message, sourceRowVerified, formRowNumber, formStatus) {
  return {
    authorized: false,
    configurationUnavailable: false,
    permanentBlock: true,
    formStatus: formStatus || STATUS.BLOCKED,
    reasonCode: reasonCode,
    message: message,
    sourceRowVerified: !!sourceRowVerified,
    formRowNumber: formRowNumber || 0
  };
}

function blockQueueJobForAuthorization_(job, decision) {
  if (!job || !decision || !decision.permanentBlock) {
    throw new Error('A permanent authorization decision is required before blocking a queue job.');
  }

  var alreadyBlocked = String(job.Status || '').trim() === STATUS.BLOCKED &&
    String(job.CurrentPhase || '').trim() === 'Blocked by authorized-email gate';
  if (alreadyBlocked) {
    return job;
  }

  var errorMessage = decision.formStatus === STATUS.UNAUTHORIZED
    ? 'Requester email is not authorized. This job cannot continue.'
    : 'Queue job failed authorized-email identity validation and cannot continue.';
  var updates = {
    Status: STATUS.BLOCKED,
    CurrentPhase: 'Blocked by authorized-email gate',
    LastError: errorMessage,
    NextRetryAt: '',
    WorkerLeaseToken: '',
    WorkerLeaseUntil: '',
    WorkerStartedAt: ''
  };

  if (job._leaseToken) {
    releaseWorkerLease_(job, updates);
  } else {
    updateQueueJob_(job, updates);
  }

  if (decision.sourceRowVerified && decision.formRowNumber > 1) {
    var responseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.FORM_RESPONSES);
    if (responseSheet) {
      writeOutputFields_(responseSheet, decision.formRowNumber, {
        ProcessingStatus: decision.formStatus || STATUS.BLOCKED,
        QueuePosition: '',
        ErrorMessage: errorMessage,
        LastUpdatedAt: now_()
      });
    }
  }

  logProcessing_(
    job.SubmissionID,
    job.JobID,
    STATUS.BLOCKED,
    'Queue job permanently blocked by the authorized-email gate before generation; no generation or outbound email action was performed. Reason code: ' + decision.reasonCode + '.',
    ''
  );
  return job;
}

function logAuthorizationConfigurationPause_(job, phase) {
  logProcessing_(
    job && job.SubmissionID || '',
    job && job.JobID || '',
    AUTHORIZATION_CONFIG_LOG_STATUS_,
    'Queue processing paused before ' + phase + ' because authorized-email configuration was unavailable or invalid. The queue job was not changed.',
    ''
  );
}

function ensureAuthorizedEmailsSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAMES.AUTHORIZED_EMAILS);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAMES.AUTHORIZED_EMAILS);
    sheet.getRange(1, 1).setValue(AUTHORIZED_EMAILS_HEADERS[0]);
    return sheet;
  }

  var currentHeader = String(sheet.getRange(1, 1).getValue() || '');
  if (!currentHeader) {
    sheet.getRange(1, 1).setValue(AUTHORIZED_EMAILS_HEADERS[0]);
    return sheet;
  }
  if (currentHeader !== AUTHORIZED_EMAILS_HEADERS[0]) {
    throw new Error('AUTHORIZED_EMAILS cell A1 is nonblank and is not the exact Email header. Existing data was preserved.');
  }

  return sheet;
}
