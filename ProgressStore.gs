function withScriptLock_(callback, waitMs) {
  var lock = LockService.getScriptLock();
  lock.waitLock(waitMs || 10000);
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}

function appendObjectRow_(sheet, desiredHeaders, object) {
  appendMissingHeaders_(sheet, desiredHeaders || Object.keys(object));
  var headers = getHeaderMap_(sheet);
  var lastColumn = sheet.getLastColumn();
  var row = new Array(lastColumn);

  Object.keys(headers).forEach(function (header) {
    row[headers[header] - 1] = object.hasOwnProperty(header) ? object[header] : '';
  });

  sheet.appendRow(row);
  return sheet.getLastRow();
}

function updateObjectRow_(sheet, rowNumber, updates) {
  var headers = getHeaderMap_(sheet);
  Object.keys(updates).forEach(function (key) {
    writeCell_(sheet, rowNumber, headers, key, updates[key]);
  });
}

function getSheetObjects_(sheetOrName) {
  var sheet = typeof sheetOrName === 'string' ? getSheetByName_(sheetOrName) : sheetOrName;
  if (!sheet || sheet.getLastRow() < 2) {
    return [];
  }

  var values = sheet.getDataRange().getValues();
  var headers = getHeaderMap_(sheet);
  var rows = [];

  for (var r = 2; r <= values.length; r++) {
    var obj = rowFromValues_(values[r - 1], headers);
    obj._rowNumber = r;
    rows.push(obj);
  }

  return rows;
}

function findRowNumberByColumnValue_(sheet, columnName, value) {
  var headers = getHeaderMap_(sheet);
  var columnIndex = headers[columnName];
  if (!columnIndex || sheet.getLastRow() < 2) {
    return 0;
  }

  var values = sheet.getRange(2, columnIndex, sheet.getLastRow() - 1, 1).getValues();
  var target = String(value || '');
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0] || '') === target) {
      return i + 2;
    }
  }

  return 0;
}

function findQueueRowByJobId_(jobId) {
  var sheet = getSheetByName_(SHEET_NAMES.GENERATION_QUEUE);
  return findRowNumberByColumnValue_(sheet, 'JobID', jobId);
}

function getQueueJobByRow_(rowNumber) {
  var sheet = getSheetByName_(SHEET_NAMES.GENERATION_QUEUE);
  if (rowNumber <= 1) {
    return null;
  }

  var job = rowFromValues_(sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0], getHeaderMap_(sheet));
  job._rowNumber = rowNumber;
  return job;
}

function updateQueueJob_(job, updates) {
  if (job && job._leaseToken) {
    return updateQueueJobWithLease_(job, updates, job._leaseToken);
  }

  var sheet = getSheetByName_(SHEET_NAMES.GENERATION_QUEUE);
  var rowNumber = job._rowNumber || findQueueRowByJobId_(job.JobID);
  if (!rowNumber) {
    throw new Error('Could not find GENERATION_QUEUE row for job ' + job.JobID + '.');
  }

  updates.UpdatedAt = updates.UpdatedAt || now_();
  updateObjectRow_(sheet, rowNumber, updates);
  Object.keys(updates).forEach(function (key) {
    job[key] = updates[key];
  });
}

function updateQueueJobWithLease_(job, updates, leaseToken) {
  return withScriptLock_(function () {
    var sheet = getSheetByName_(SHEET_NAMES.GENERATION_QUEUE);
    var rowNumber = job._rowNumber || findQueueRowByJobId_(job.JobID);
    if (!rowNumber) {
      throw new Error('Could not find GENERATION_QUEUE row for leased job ' + job.JobID + '.');
    }

    var current = getQueueJobByRow_(rowNumber);
    if (String(current.WorkerLeaseToken || '') !== String(leaseToken || '')) {
      throw createClassifiedError_('Worker lease no longer owns job ' + job.JobID + '.', 'temporary');
    }

    updates.UpdatedAt = updates.UpdatedAt || now_();
    updateObjectRow_(sheet, rowNumber, updates);
    Object.keys(updates).forEach(function (key) {
      job[key] = updates[key];
    });

    if (updates.hasOwnProperty('WorkerLeaseToken') && !updates.WorkerLeaseToken) {
      delete job._leaseToken;
    }

    job._rowNumber = rowNumber;
    return job;
  });
}

function updateFormResponseProgress_(job, updates) {
  var sheet = getResponseSheet_();
  var rowNumber = Number(job.FormResponseRow || 0);
  if (!rowNumber || rowNumber <= 1) {
    return;
  }

  updates.LastUpdatedAt = updates.LastUpdatedAt || now_();
  writeOutputFields_(sheet, rowNumber, updates);
}

function getTermDayRowsForJob_(jobId) {
  var sheet = getSheetByName_(SHEET_NAMES.TERM_DAY_PLAN);
  appendMissingHeaders_(sheet, TERM_DAY_PLAN_HEADERS);

  return getSheetObjects_(sheet).filter(function (row) {
    return String(row.JobID || '') === String(jobId || '');
  }).sort(function (a, b) {
    return Number(a.DayNumber) - Number(b.DayNumber);
  });
}

function updateTermDayRow_(dayRow, updates) {
  var sheet = getSheetByName_(SHEET_NAMES.TERM_DAY_PLAN);
  if (!dayRow._rowNumber) {
    throw new Error('TERM_DAY_PLAN row number is missing for day ' + dayRow.DayNumber + '.');
  }

  updateObjectRow_(sheet, dayRow._rowNumber, updates);
  Object.keys(updates).forEach(function (key) {
    dayRow[key] = updates[key];
  });
}
