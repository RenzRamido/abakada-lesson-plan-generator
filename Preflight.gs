function runPreflightChecks() {
  var report = runPreflightChecks_();
  SpreadsheetApp.getUi().alert(report.summary + '\n\n' + report.lines.join('\n'));
}

function runPreflightChecks_() {
  var startedAt = new Date().getTime();
  var lines = [];
  var failures = 0;

  function pass(message) {
    lines.push('PASS: ' + message);
  }

  function fail(message) {
    failures += 1;
    lines.push('FAIL: ' + message);
  }

  checkSheetAndHeaders_(SHEET_NAMES.FORM_RESPONSES, FORM_RESPONSE_HEADERS, pass, fail);
  checkSheetAndHeaders_(SHEET_NAMES.BOW_DATABASE, BOW_HEADERS, pass, fail);
  checkExactSheetAndHeaders_(SHEET_NAMES.BOW_DATABASE_AUDIT, BOW_DATABASE_AUDIT_HEADERS, pass, fail);
  checkSheetAndHeaders_(SHEET_NAMES.BOW_PACING_METADATA, BOW_PACING_METADATA_HEADERS, pass, fail);
  checkExactSheetAndHeaders_(
    SHEET_NAMES.BOW_PACING_METADATA_AUDIT,
    BOW_PACING_METADATA_AUDIT_HEADERS,
    pass,
    fail
  );
  checkExactSheetAndHeaders_(
    SHEET_NAMES.CURRICULUM_IMPORT_MANIFEST,
    CURRICULUM_IMPORT_MANIFEST_HEADERS,
    pass,
    fail
  );
  checkSheetAndHeaders_(SHEET_NAMES.SUPPORT_MATRIX, SUPPORT_MATRIX_HEADERS, pass, fail);
  checkSheetAndHeaders_(SHEET_NAMES.SUBJECT_PROFILES, SUBJECT_PROFILES_HEADERS, pass, fail);
  checkSheetAndHeaders_(SHEET_NAMES.CONFIG, CONFIG_HEADERS, pass, fail);
  checkSheetAndHeaders_(SHEET_NAMES.PROCESSING_LOG, PROCESSING_LOG_HEADERS, pass, fail);
  checkSheetAndHeaders_(SHEET_NAMES.GENERATED_HISTORY, GENERATED_HISTORY_HEADERS, pass, fail);
  checkSheetAndHeaders_(SHEET_NAMES.GENERATION_QUEUE, QUEUE_HEADERS, pass, fail);
  checkSheetAndHeaders_(SHEET_NAMES.TERM_DAY_PLAN, TERM_DAY_PLAN_HEADERS, pass, fail);
  checkAuthorizedEmails_(pass, fail);

  Object.keys(DEFAULT_CONFIG).forEach(function (key) {
    var value = getConfigValue(key, null);
    if (value === null || typeof value === 'undefined') {
      fail('CONFIG key missing: ' + key);
    } else {
      pass('CONFIG key exists: ' + key);
    }
  });

  if (Number(getConfigValue('OPENAI_MAX_OUTPUT_TOKENS', DEFAULT_CONFIG.OPENAI_MAX_OUTPUT_TOKENS)) >= 6000) {
    pass('OPENAI_MAX_OUTPUT_TOKENS is high enough for detailed daily lessons.');
  } else {
    fail('OPENAI_MAX_OUTPUT_TOKENS is below 6000. Raise it before full-term testing to reduce truncation risk.');
  }

  if (PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY')) {
    pass('OpenAI API key exists in PropertiesService.');
  } else {
    fail('OpenAI API key is missing from PropertiesService.');
  }

  if (getConfigValue('ADMIN_EMAIL', '')) {
    pass('ADMIN_EMAIL is configured.');
  } else {
    fail('ADMIN_EMAIL is blank.');
  }

  try {
    getOutputFolder_();
    pass('Output folder is accessible.');
  } catch (err) {
    fail('Output folder is not accessible: ' + (err && err.message ? err.message : String(err)));
  }

  var templateId = getConfigValue('TEMPLATE_DOC_ID', '');
  if (templateId) {
    try {
      DocumentApp.openById(templateId);
      pass('Template document is accessible.');
    } catch (err) {
      fail('Template document is not accessible: ' + (err && err.message ? err.message : String(err)));
    }
  } else {
    pass('Template document is optional and currently blank.');
  }

  var snapshot = loadPreflightSupportSnapshot_();
  checkSupportFramework_(snapshot, pass, fail);
  checkCurriculumImportAuditFramework_(pass, fail);

  var triggerCounts = getTriggerCounts_();
  if (triggerCounts.formSubmit === 1) {
    pass('Exactly one onFormSubmit trigger exists.');
  } else if (!triggerCounts.formSubmit) {
    fail('onFormSubmit trigger is missing. Exactly one form-submit trigger is required.');
  } else {
    fail('Duplicate onFormSubmit triggers detected: ' + triggerCounts.formSubmit + '. Exactly one form-submit trigger is required.');
  }
  triggerCounts.worker ? pass('processGenerationQueue worker trigger exists.') : fail('processGenerationQueue worker trigger is missing.');
  triggerCounts.worker <= 1 ? pass('No duplicate active worker triggers detected.') : fail('Duplicate processGenerationQueue worker triggers detected: ' + triggerCounts.worker + '.');

  var durationMs = new Date().getTime() - startedAt;
  pass('Preflight validation completed in ' + (durationMs / 1000).toFixed(2) + ' second(s).');

  return {
    failures: failures,
    lines: lines,
    durationMs: durationMs,
    summary: failures ? 'Preflight found ' + failures + ' issue(s).' : 'Preflight passed.'
  };
}

function checkAuthorizedEmails_(pass, fail) {
  var inspection = inspectAuthorizedEmailConfiguration_();

  if (inspection.readError) {
    fail('AUTHORIZED_EMAILS could not be read.');
    return;
  }
  if (!inspection.sheetExists) {
    fail('Sheet missing: ' + SHEET_NAMES.AUTHORIZED_EMAILS);
    return;
  }
  if (!inspection.headerValid) {
    fail('AUTHORIZED_EMAILS cell A1 must be exactly Email.');
  } else {
    pass('AUTHORIZED_EMAILS exact Email header verified.');
  }
  if (inspection.unexpectedColumnRows.length) {
    fail('AUTHORIZED_EMAILS has populated cells outside column A on row(s): ' + inspection.unexpectedColumnRows.join(', ') + '.');
  } else {
    pass('AUTHORIZED_EMAILS has no populated cells outside column A.');
  }
  if (inspection.invalidRows.length) {
    fail('AUTHORIZED_EMAILS has invalid nonblank address value(s) on row(s): ' + inspection.invalidRows.join(', ') + '.');
  } else {
    pass('AUTHORIZED_EMAILS nonblank address values are structurally valid.');
  }
  if (inspection.duplicateRows.length) {
    fail('AUTHORIZED_EMAILS has case-insensitive duplicate address rows: ' + inspection.duplicateRows.join(', ') + '.');
  } else {
    pass('AUTHORIZED_EMAILS has no case-insensitive duplicate addresses.');
  }
  if (!inspection.count) {
    fail('AUTHORIZED_EMAILS must contain at least one valid authorized address.');
  } else {
    pass('AUTHORIZED_EMAILS contains ' + inspection.count + ' unique valid authorized address(es).');
  }

  try {
    var loaded = assertAuthorizedEmailConfiguration_();
    pass('Runtime authorization loader succeeded for ' + loaded.count + ' authorized address(es).');
  } catch (err) {
    fail('Runtime authorization loader rejected AUTHORIZED_EMAILS configuration.');
  }
}

function checkSheetAndHeaders_(sheetName, headers, pass, fail) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    fail('Sheet missing: ' + sheetName);
    return;
  }

  var map = getHeaderMap_(sheet);
  var missing = headers.filter(function (header) {
    return !map[header];
  });

  if (missing.length) {
    fail(sheetName + ' missing header(s): ' + missing.join(', '));
  } else {
    pass(sheetName + ' headers verified.');
  }
}

function checkExactSheetAndHeaders_(sheetName, headers, pass, fail) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    fail('Sheet missing: ' + sheetName);
    return;
  }
  var lastColumn = sheet.getLastColumn();
  if (sheet.getLastRow() < 1 || lastColumn !== headers.length) {
    fail(sheetName + ' must have exactly ' + headers.length + ' canonical columns.');
    return;
  }
  var actual = sheet.getRange(1, 1, 1, lastColumn).getValues()[0]
    .map(function (value) { return String(value || '').trim(); });
  if (actual.join('\u001f') !== headers.join('\u001f')) {
    fail(sheetName + ' has missing, reordered, additional, or incorrect headers.');
  } else {
    pass(sheetName + ' exact append-only schema verified.');
  }
}

function checkCurriculumImportAuditFramework_(pass, fail) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var pacingAuditSheet = spreadsheet.getSheetByName(
    SHEET_NAMES.BOW_PACING_METADATA_AUDIT
  );
  var manifestSheet = spreadsheet.getSheetByName(
    SHEET_NAMES.CURRICULUM_IMPORT_MANIFEST
  );
  if (!pacingAuditSheet || !manifestSheet) {
    fail('Legacy curriculum-import administrative sheets are missing.');
    return;
  }
  var pacingAuditRows = Math.max(pacingAuditSheet.getLastRow() - 1, 0);
  var manifestRows = Math.max(manifestSheet.getLastRow() - 1, 0);
  if (!pacingAuditRows && !manifestRows) {
    pass(
      'Legacy BOW_PACING_METADATA_AUDIT and CURRICULUM_IMPORT_MANIFEST are empty; ' +
      'the staging importer does not require ledger records.'
    );
    return;
  }
  fail(
    'Administrative review required: legacy curriculum-import records exist ' +
    '(BOW_PACING_METADATA_AUDIT: ' + pacingAuditRows +
    ', CURRICULUM_IMPORT_MANIFEST: ' + manifestRows +
    '). The simplified staging importer will not modify or interpret them.'
  );
}

function loadPreflightSupportSnapshot_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var supportRows = readPreflightSheetObjects_(
    spreadsheet.getSheetByName(SHEET_NAMES.SUPPORT_MATRIX)
  );
  var profileRows = readPreflightSheetObjects_(
    spreadsheet.getSheetByName(SHEET_NAMES.SUBJECT_PROFILES)
  );
  var bowRows = readPreflightSheetObjects_(
    spreadsheet.getSheetByName(SHEET_NAMES.BOW_DATABASE)
  );
  var pacingMetadataRows = readPreflightSheetObjects_(
    spreadsheet.getSheetByName(SHEET_NAMES.BOW_PACING_METADATA)
  );
  var bowIndexes = buildPreflightBowIndex_(bowRows);
  var supportIndex = {};

  supportRows.forEach(function (row) {
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    supportIndex[key] = supportIndex[key] || [];
    supportIndex[key].push(row);
  });

  return {
    supportRows: supportRows,
    profileRows: profileRows,
    bowRows: bowRows,
    pacingMetadataRows: pacingMetadataRows,
    supportIndex: supportIndex,
    profileIndex: buildPreflightProfileIndex_(profileRows),
    bowIndex: bowIndexes.byTuple,
    bowIdIndex: bowIndexes.byId
  };
}

function readPreflightSheetObjects_(sheet) {
  if (!sheet || sheet.getLastRow() < 2) {
    return [];
  }

  var values = sheet.getDataRange().getValues();
  var headers = values[0].map(function (header) {
    return String(header || '').trim();
  });
  var rows = [];

  for (var r = 1; r < values.length; r++) {
    var hasValue = values[r].some(function (value) {
      return value !== '' && value !== null && typeof value !== 'undefined';
    });
    if (!hasValue) {
      continue;
    }

    var row = { _rowNumber: r + 1 };
    headers.forEach(function (header, index) {
      if (header) {
        row[header] = values[r][index];
      }
    });
    rows.push(row);
  }

  return rows;
}

function buildPreflightProfileIndex_(profileRows) {
  var index = {};
  (profileRows || []).forEach(function (row) {
    var key = normalizeForMatch_(row.PromptProfile);
    if (!key) {
      return;
    }
    index[key] = index[key] || [];
    index[key].push(row);
  });
  return index;
}

function buildPreflightBowIndex_(bowRows) {
  var byTuple = {};
  var byId = {};

  (bowRows || []).forEach(function (row) {
    var tupleKey = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    var bowIdKey = normalizeForMatch_(row.BOW_ID);
    byTuple[tupleKey] = byTuple[tupleKey] || [];
    byTuple[tupleKey].push(row);

    if (bowIdKey) {
      byId[bowIdKey] = byId[bowIdKey] || [];
      byId[bowIdKey].push(row);
    }
  });

  return {
    byTuple: byTuple,
    byId: byId
  };
}

function checkSupportFramework_(snapshot, pass, fail) {
  var supportRows = snapshot.supportRows;
  var profileRows = snapshot.profileRows;
  var bowRows = snapshot.bowRows;

  supportRows.length ? pass('SUPPORT_MATRIX has ' + supportRows.length + ' row(s).') : fail('SUPPORT_MATRIX has no support rows.');
  profileRows.length ? pass('SUBJECT_PROFILES has ' + profileRows.length + ' row(s).') : fail('SUBJECT_PROFILES has no profile rows.');
  bowRows.length ? pass('BOW_DATABASE has ' + bowRows.length + ' row(s).') : fail('BOW_DATABASE has no BOW rows.');

  checkDuplicateSupportMatrixRows_(supportRows, pass, fail);
  checkDuplicateSubjectProfileRows_(profileRows, pass, fail);
  checkBowPacingMetadataFramework_(snapshot, pass, fail);
  checkActiveSupportRows_(supportRows, snapshot, pass, fail);
  checkExpectedMathCoverage_(snapshot, pass, fail);
  checkBaselineGrade2MathSupport_(supportRows, snapshot.bowIndex, pass, fail);
}

function checkDuplicateSupportMatrixRows_(supportRows, pass, fail) {
  var seen = {};
  var duplicates = [];

  supportRows.forEach(function (row) {
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    if (seen[key]) {
      duplicates.push(formatSupportRowLabel_(row));
    } else {
      seen[key] = true;
    }
  });

  duplicates.length ? fail('Duplicate SUPPORT_MATRIX row(s): ' + duplicates.join('; ')) : pass('No duplicate SUPPORT_MATRIX grade/subject/term rows detected.');
}

function checkDuplicateSubjectProfileRows_(profileRows, pass, fail) {
  var seen = {};
  var duplicates = [];

  profileRows.forEach(function (row) {
    var key = normalizeForMatch_(row.PromptProfile);
    if (!key) {
      return;
    }
    if (seen[key]) {
      duplicates.push(row.PromptProfile);
    } else {
      seen[key] = true;
    }
  });

  duplicates.length ? fail('Duplicate SUBJECT_PROFILES PromptProfile row(s): ' + duplicates.join(', ')) : pass('No duplicate SUBJECT_PROFILES PromptProfile rows detected.');
}

function checkBowPacingMetadataFramework_(snapshot, pass, fail) {
  var metadataRows = snapshot.pacingMetadataRows || [];
  if (!metadataRows.length) {
    pass('BOW_PACING_METADATA is empty; existing BOW tuples remain in legacy calendar mode.');
    return;
  }

  var requiredFields = BOW_PACING_METADATA_HEADERS.filter(function (header) {
    return header !== 'Notes' && header !== 'OfficialDayCount';
  });
  var seenBowIds = {};
  var tupleKeys = {};
  var rowErrors = [];

  metadataRows.forEach(function (row) {
    var bowId = String(row.BOW_ID || '').trim();
    var bowIdKey = normalizeForMatch_(bowId);
    requiredFields.forEach(function (fieldName) {
      if (!String(row[fieldName] || '').trim()) {
        rowErrors.push('metadata row ' + row._rowNumber + ' missing ' + fieldName);
      }
    });
    if (bowIdKey) {
      if (seenBowIds[bowIdKey]) {
        rowErrors.push('duplicate metadata BOW_ID ' + bowId);
      }
      seenBowIds[bowIdKey] = true;
    }

    var bowMatches = snapshot.bowIdIndex[bowIdKey] || [];
    if (bowMatches.length !== 1) {
      rowErrors.push(
        'metadata BOW_ID ' + (bowId || '(blank)') +
        ' must match exactly one BOW_DATABASE row; found ' + bowMatches.length
      );
      return;
    }
    tupleKeys[supportMatrixKey_(
      bowMatches[0].GradeLevel,
      bowMatches[0].Subject,
      bowMatches[0].Term
    )] = true;
  });

  if (rowErrors.length) {
    fail('BOW_PACING_METADATA row validation failed: ' + rowErrors.slice(0, 10).join('; ') + '.');
  } else {
    pass('BOW_PACING_METADATA has ' + metadataRows.length + ' unique, complete row(s).');
  }

  Object.keys(tupleKeys).forEach(function (tupleKey) {
    var records = snapshot.bowIndex[tupleKey] || [];
    if (!records.length) {
      fail('BOW_PACING_METADATA references tuple with no BOW_DATABASE rows: ' + tupleKey + '.');
      return;
    }
    var label = [records[0].GradeLevel, records[0].Subject, records[0].Term].join(' / ');
    var identityErrors = checkGmrcValuesSupportIdentity_({
      GradeLevel: records[0].GradeLevel,
      Subject: records[0].Subject,
      Term: records[0].Term
    }, label);
    if (identityErrors.length) {
      identityErrors.forEach(fail);
      return;
    }
    var tupleMetadataRows = metadataRows.filter(function (metadataRow) {
      var matches = snapshot.bowIdIndex[normalizeForMatch_(metadataRow.BOW_ID)] || [];
      return matches.length === 1 && supportMatrixKey_(
        matches[0].GradeLevel,
        matches[0].Subject,
        matches[0].Term
      ) === tupleKey;
    });
    var missingDayCountRows = tupleMetadataRows.filter(function (metadataRow) {
      return !String(metadataRow.OfficialDayCount || '').trim();
    });
    var activeSupportRows = (snapshot.supportIndex[tupleKey] || []).filter(function (supportRow) {
      return normalizeForMatch_(supportRow.Status) === 'active' && isTruthyFlag_(supportRow.Active);
    });

    if (missingDayCountRows.length) {
      try {
        validateIncompleteOfficialPacingMetadataTuple_(records, tupleMetadataRows);
        if (activeSupportRows.length) {
          fail(
            label + ' is active but has ' + missingDayCountRows.length +
            ' BOW pacing row(s) without OfficialDayCount.'
          );
        } else {
          pass(
            label + ' | Inactive review metadata has valid weeks and SourceOrder 1-' +
            tupleMetadataRows.length + ' but requires ' + missingDayCountRows.length +
            ' OfficialDayCount value(s) before activation.'
          );
        }
      } catch (err) {
        fail(label + ' has invalid review-only pacing metadata: ' + (err && err.message ? err.message : String(err)));
      }
      return;
    }
    try {
      var calendar = resolveTermCalendar_(
        records[0].GradeLevel,
        records[0].Subject,
        records[0].Term,
        records,
        metadataRows
      );
      if (calendar.mode !== 'official_fixed') {
        throw new Error('tuple did not resolve as official_fixed');
      }
      if (hasConstructedPacingBowNotice_(calendar.orderedBowRecords)) {
        throw new Error('official-fixed BOW rows contain the constructed-pacing marker');
      }
      pass(
        label +
        ' | Official calendar: ' + formatOfficialWeekRange_(calendar) +
        ' | Days: ' + calendar.totalTeachingDays +
        ' | SourceOrder: 1-' + calendar.resolvedItems.length +
        ' | Fingerprint: ' + calendar.fingerprint
      );
    } catch (err) {
      fail(
        label +
        ' has invalid official pacing metadata: ' +
        (err && err.message ? err.message : String(err))
      );
    }
  });
}

function validateIncompleteOfficialPacingMetadataTuple_(records, metadataRows) {
  var metadataIndex = buildBowPacingMetadataIndex_(metadataRows);
  var resolved = (records || []).map(function (record) {
    var bowId = String(record.BOW_ID || '').trim();
    var matches = metadataIndex[bowId] || [];
    if (matches.length !== 1) {
      throw new Error('Expected exactly one pacing metadata row for ' + bowId + '; found ' + matches.length + '.');
    }
    var metadata = matches[0];
    if (normalizeForMatch_(metadata.PacingBasis) !== normalizeForMatch_(OFFICIAL_FIXED_PACING_BASIS_)) {
      throw new Error(bowId + ' must use PacingBasis ' + OFFICIAL_FIXED_PACING_BASIS_ + '.');
    }
    var bowWeek = parseBowWeekRange_(record.WeekNumber);
    var labelWeek = parseBowWeekRange_(metadata.OfficialWeekLabel);
    var weekStart = requirePositiveCalendarInteger_(metadata.WeekStart, 'WeekStart', bowId);
    var weekEnd = requirePositiveCalendarInteger_(metadata.WeekEnd, 'WeekEnd', bowId);
    var sourceOrder = requirePositiveCalendarInteger_(metadata.SourceOrder, 'SourceOrder', bowId);
    if (
      !bowWeek.valid ||
      !labelWeek.valid ||
      bowWeek.start !== weekStart ||
      bowWeek.end !== weekEnd ||
      labelWeek.start !== weekStart ||
      labelWeek.end !== weekEnd
    ) {
      throw new Error(bowId + ' has inconsistent BOW and official week values.');
    }
    if (String(record.Notes || '').indexOf('ABAKADA-constructed weekly pacing') !== -1) {
      throw new Error(bowId + ' contains the constructed-pacing marker.');
    }
    if (String(metadata.OfficialDayCount || '').trim()) {
      requirePositiveCalendarInteger_(metadata.OfficialDayCount, 'OfficialDayCount', bowId);
    }
    return {
      bowId: bowId,
      sourceOrder: sourceOrder,
      weekStart: weekStart,
      weekEnd: weekEnd
    };
  });

  resolved.sort(function (a, b) { return a.sourceOrder - b.sourceOrder; });
  resolved.forEach(function (item, index) {
    if (item.sourceOrder !== index + 1) {
      throw new Error(
        'SourceOrder must be the exact contiguous sequence 1 through ' + resolved.length +
        '; expected ' + (index + 1) + ', found ' + item.sourceOrder + ' for ' + item.bowId + '.'
      );
    }
  });

  var coveredWeeks = {};
  var maxWeek = 0;
  resolved.forEach(function (item) {
    maxWeek = Math.max(maxWeek, item.weekEnd);
    for (var week = item.weekStart; week <= item.weekEnd; week++) {
      coveredWeeks[week] = true;
    }
  });
  for (var expectedWeek = 1; expectedWeek <= maxWeek; expectedWeek++) {
    if (!coveredWeeks[expectedWeek]) {
      throw new Error('Official week coverage is missing Week ' + expectedWeek + '.');
    }
  }
}

function checkGmrcValuesSupportIdentity_(row, label) {
  var subject = normalizeForMatch_(row.Subject);
  if (subject !== 'gmrc' && subject !== 'values education') {
    return [];
  }

  var match = String(row.GradeLevel || '').trim().match(/^Grade\s+(\d+)$/i);
  if (!match) {
    return [label + ' has an invalid GradeLevel for ' + row.Subject + '.'];
  }
  var grade = Number(match[1]);
  if (subject === 'gmrc' && (grade < 1 || grade > 6)) {
    return [label + ' is invalid. GMRC is supported only for Grades 1 through 6.'];
  }
  if (subject === 'values education' && (grade < 7 || grade > 10)) {
    return [label + ' is invalid. Values Education is supported only for Grades 7 through 10.'];
  }
  return [];
}

function checkActiveSupportRows_(supportRows, snapshot, pass, fail) {
  var activeRows = supportRows.filter(function (row) {
    return normalizeForMatch_(row.Status) === 'active' && isTruthyFlag_(row.Active);
  });
  var activeBowIds = {};

  if (!activeRows.length) {
    fail('SUPPORT_MATRIX has no processable Active rows.');
    return;
  }

  pass('SUPPORT_MATRIX has ' + activeRows.length + ' processable Active row(s).');

  activeRows.forEach(function (row) {
    var label = formatSupportRowLabel_(row);
    var errors = [];

    if (!isTruthyFlag_(row.BOWComplete)) {
      errors.push(label + ' has BOWComplete not set to Yes.');
    }
    if (!isTruthyFlag_(row.TeacherReviewed)) {
      errors.push(label + ' has TeacherReviewed not set to Yes.');
    }
    errors = errors.concat(checkGmrcValuesSupportIdentity_(row, label));

    var profileResult = checkSupportRowProfile_(row, label, snapshot.profileIndex);
    var bowResult = checkSupportRowBowRecords_(row, label, snapshot);
    errors = errors.concat(profileResult.errors, bowResult.errors);

    bowResult.records.forEach(function (record) {
      var bowIdKey = normalizeForMatch_(record.BOW_ID);
      if (bowIdKey) {
        activeBowIds[bowIdKey] = String(record.BOW_ID || '').trim();
      }
    });

    if (errors.length) {
      errors.forEach(fail);
    } else {
      pass(
        label +
        ' | Profile: ' + profileResult.profile.PromptProfile +
        ' | BOW rows: ' + bowResult.records.length +
        ' | Coverage mode: ' + bowResult.coverageMode +
        ' | fields, IDs, and weeks valid.'
      );
    }
  });

  var globalDuplicates = Object.keys(activeBowIds).filter(function (bowIdKey) {
    return (snapshot.bowIdIndex[bowIdKey] || []).length > 1;
  }).map(function (bowIdKey) {
    return activeBowIds[bowIdKey];
  });

  globalDuplicates.length
    ? fail('Active coverage contains globally duplicated BOW_ID value(s): ' + globalDuplicates.join(', ') + '.')
    : pass('BOW_ID values are globally unique across active support coverage.');
}

function checkSupportRowProfile_(row, label, profileIndex) {
  var errors = [];
  var promptProfile = String(row.PromptProfile || '').trim();

  if (!promptProfile) {
    errors.push(label + ' has a blank PromptProfile.');
    return { profile: null, errors: errors };
  }

  var matches = profileIndex[normalizeForMatch_(promptProfile)] || [];
  if (!matches.length) {
    errors.push(label + ' references missing PromptProfile: ' + promptProfile + '.');
    return { profile: null, errors: errors };
  }
  if (matches.length > 1) {
    errors.push(label + ' references duplicate PromptProfile rows: ' + promptProfile + '.');
    return { profile: matches[0], errors: errors };
  }

  var profile = matches[0];
  if (!isTruthyFlag_(profile.Active)) {
    errors.push(label + ' references inactive PromptProfile: ' + promptProfile + '.');
  }
  if (normalizeForMatch_(profile.Subject) !== normalizeForMatch_(row.Subject)) {
    errors.push(label + ' references PromptProfile with mismatched subject: ' + promptProfile + '.');
  }

  return { profile: profile, errors: errors };
}

function checkSupportRowBowRecords_(row, label, snapshot) {
  var records = snapshot.bowIndex[supportMatrixKey_(row.GradeLevel, row.Subject, row.Term)] || [];
  var errors = [];
  var coverageMode = 'standard single-BOW/day';
  var calendar = null;

  if (!records.length) {
    errors.push(label + ' has no BOW_DATABASE records.');
    return { records: records, errors: errors, coverageMode: coverageMode };
  }

  try {
    calendar = resolveTermCalendar_(
      row.GradeLevel,
      row.Subject,
      row.Term,
      records,
      snapshot.pacingMetadataRows
    );
    records = calendar.orderedBowRecords;
  } catch (err) {
    errors.push(label + ' has invalid term calendar: ' + (err && err.message ? err.message : String(err)));
  }

  var requiredFields = BOW_HEADERS.filter(function (header) {
    return header !== 'Notes';
  });
  var missing = [];
  var seenBowIds = {};
  var duplicateBowIds = [];
  var weekErrors = [];
  var idErrors = [];
  var previousWeek = null;

  records.forEach(function (record) {
    requiredFields.forEach(function (fieldName) {
      if (!String(record[fieldName] || '').trim()) {
        missing.push((record.BOW_ID || '(blank BOW_ID)') + ' missing ' + fieldName);
      }
    });

    var bowId = String(record.BOW_ID || '').trim();
    var bowIdKey = normalizeForMatch_(bowId);
    if (bowIdKey) {
      if (seenBowIds[bowIdKey]) {
        duplicateBowIds.push(bowId);
      } else {
        seenBowIds[bowIdKey] = true;
      }
    }

    var week = parsePreflightWeekRange_(record.WeekNumber);
    if (!week.valid) {
      weekErrors.push((bowId || '(blank BOW_ID)') + ': ' + week.reason);
    } else {
      if (
        previousWeek &&
        (week.start < previousWeek.start ||
          (week.start === previousWeek.start && week.end < previousWeek.end))
      ) {
        weekErrors.push((bowId || '(blank BOW_ID)') + ': week order moves backward.');
      }
      previousWeek = week;
    }

    idErrors = idErrors.concat(checkMathBowIdConvention_(record, week));
  });

  if (missing.length) {
    errors.push(label + ' has incomplete BOW_DATABASE fields: ' + missing.slice(0, 5).join('; ') + '.');
  }
  if (duplicateBowIds.length) {
    errors.push(label + ' has duplicate BOW_ID values: ' + duplicateBowIds.join(', ') + '.');
  }
  if (weekErrors.length) {
    errors.push(label + ' has invalid BOW week data: ' + weekErrors.slice(0, 5).join('; ') + '.');
  }
  if (idErrors.length) {
    errors.push(label + ' has invalid Mathematics BOW_ID data: ' + idErrors.slice(0, 5).join('; ') + '.');
  }

  var totalDays = calendar
    ? Number(calendar.totalTeachingDays)
    : Number(getTermDayCount_(row.Term));
  if (calendar && calendar.mode === 'official_fixed') {
    coverageMode = 'official fixed pacing (' + records.length +
      ' IDs / ' + totalDays + ' days / ' + formatOfficialWeekRange_(calendar) + ')';
  } else if (records.length > totalDays) {
    try {
      var denseGroups = buildDenseBowCoverageGroups_(sortBowRecords_(records.slice()), totalDays);
      var maxCovered = denseGroups.reduce(function (maxValue, group) {
        return Math.max(maxValue, group.bowIds.length);
      }, 1);
      coverageMode = 'dense multi-BOW/day (' + records.length +
        ' IDs / ' + totalDays + ' days; max ' + maxCovered + ' IDs/day)';
    } catch (err) {
      errors.push(label + ' cannot build deterministic dense BOW coverage: ' + (err && err.message ? err.message : String(err)));
    }
  }

  return { records: records, errors: errors, coverageMode: coverageMode };
}

function checkExpectedMathCoverage_(snapshot, pass, fail) {
  var expected = {};
  var terms = ['First Term', 'Second Term', 'Third Term'];

  for (var grade = 1; grade <= 10; grade++) {
    terms.forEach(function (term) {
      var row = {
        GradeLevel: 'Grade ' + grade,
        Subject: 'Mathematics',
        Term: term
      };
      expected[supportMatrixKey_(row.GradeLevel, row.Subject, row.Term)] = {
        label: formatSupportRowLabel_(row),
        promptProfile: 'G' + grade + '_MATH_DEFAULT'
      };
    });
  }

  terms.forEach(function (term) {
    var row = {
      GradeLevel: 'Grade 11',
      Subject: 'General Mathematics',
      Term: term
    };
    expected[supportMatrixKey_(row.GradeLevel, row.Subject, row.Term)] = {
      label: formatSupportRowLabel_(row),
      promptProfile: 'G11_GENMATH_DEFAULT'
    };
  });

  var activeMathRows = snapshot.supportRows.filter(function (row) {
    var subject = normalizeForMatch_(row.Subject);
    return (
      normalizeForMatch_(row.Status) === 'active' &&
      isTruthyFlag_(row.Active) &&
      (subject === 'mathematics' || subject === 'general mathematics')
    );
  });
  var coverageErrors = [];

  Object.keys(expected).forEach(function (key) {
    var matches = snapshot.supportIndex[key] || [];
    var activeMatches = matches.filter(function (row) {
      return normalizeForMatch_(row.Status) === 'active' && isTruthyFlag_(row.Active);
    });

    if (activeMatches.length !== 1) {
      coverageErrors.push(expected[key].label + ' has ' + activeMatches.length + ' active row(s).');
      return;
    }
    if (String(activeMatches[0].PromptProfile || '').trim() !== expected[key].promptProfile) {
      coverageErrors.push(
        expected[key].label +
        ' must use ' + expected[key].promptProfile +
        ', found ' + (activeMatches[0].PromptProfile || '(blank)') + '.'
      );
    }
  });

  activeMathRows.forEach(function (row) {
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    if (!expected[key]) {
      coverageErrors.push('Unexpected active Mathematics support tuple: ' + formatSupportRowLabel_(row) + '.');
    }
  });

  if (activeMathRows.length !== 33) {
    coverageErrors.push('Expected 33 active Mathematics support tuples, found ' + activeMathRows.length + '.');
  }

  coverageErrors.length
    ? fail('Mathematics coverage validation failed: ' + coverageErrors.slice(0, 10).join('; '))
    : pass('Exactly 33 expected Mathematics/General Mathematics support tuples are active with grade-specific profiles.');
}

function checkMathBowIdConvention_(record, parsedWeek) {
  var errors = [];
  var subject = normalizeForMatch_(record.Subject);

  if (subject !== 'mathematics' && subject !== 'general mathematics') {
    return errors;
  }

  var gradeMatch = String(record.GradeLevel || '').trim().match(/^Grade (10|11|[1-9])$/);
  if (!gradeMatch) {
    return [(record.BOW_ID || '(blank BOW_ID)') + ' has invalid GradeLevel ' + record.GradeLevel];
  }

  var grade = Number(gradeMatch[1]);
  var expectedSubject = grade === 11 ? 'general mathematics' : 'mathematics';
  var expectedCode = grade === 11 ? 'GENMATH' : 'MATH';
  if (subject !== expectedSubject) {
    errors.push(
      (record.BOW_ID || '(blank BOW_ID)') +
      ' must use Subject ' + (grade === 11 ? 'General Mathematics' : 'Mathematics')
    );
  }

  var termNumbers = {
    'First Term': 1,
    'Second Term': 2,
    'Third Term': 3
  };
  var normalizedTerm = normalizeTerm_(record.Term);
  var termNumber = termNumbers[normalizedTerm];
  if (!termNumber) {
    errors.push((record.BOW_ID || '(blank BOW_ID)') + ' has invalid Term ' + record.Term);
    return errors;
  }

  var pattern = new RegExp(
    '^BOW-G' + grade + '-' + expectedCode + '-T' + termNumber + '-W(\\d+)(?:-(\\d+))?$'
  );
  var idMatch = String(record.BOW_ID || '').trim().match(pattern);
  if (!idMatch) {
    errors.push(
      (record.BOW_ID || '(blank BOW_ID)') +
      ' does not match Grade ' + grade + ', ' + expectedCode + ', and Term ' + termNumber
    );
    return errors;
  }

  if (parsedWeek && parsedWeek.valid) {
    var idStart = Number(idMatch[1]);
    var idEnd = idMatch[2] ? Number(idMatch[2]) : idStart;
    if (idStart !== parsedWeek.start || idEnd !== parsedWeek.end) {
      errors.push(record.BOW_ID + ' does not match WeekNumber ' + record.WeekNumber);
    }
  }

  return errors;
}

function parsePreflightWeekRange_(weekValue) {
  return parseBowWeekRange_(weekValue);
}

function checkBaselineGrade2MathSupport_(supportRows, bowIndex, pass, fail) {
  ['First Term', 'Second Term', 'Third Term'].forEach(function (term) {
    var key = supportMatrixKey_('Grade 2', 'Mathematics', term);
    var rows = supportRows.filter(function (row) {
      return supportMatrixKey_(row.GradeLevel, row.Subject, row.Term) === key;
    });
    var label = 'Grade 2 Mathematics ' + term;
    var bowRows = bowIndex[key] || [];

    if (rows.length !== 1) {
      fail(label + ' must have exactly one SUPPORT_MATRIX row; found ' + rows.length + '.');
      return;
    }

    var row = rows[0];
    if (
      normalizeForMatch_(row.Status) === 'active' &&
      isTruthyFlag_(row.Active) &&
      isTruthyFlag_(row.BOWComplete) &&
      isTruthyFlag_(row.TeacherReviewed) &&
      String(row.PromptProfile || '').trim() === 'G2_MATH_DEFAULT'
    ) {
      pass(label + ' remains active in SUPPORT_MATRIX.');
    } else {
      fail(label + ' seeded support row is not fully active or no longer uses G2_MATH_DEFAULT.');
      return;
    }

    if (bowRows.length !== 10) {
      fail(label + ' must retain exactly 10 protected BOW rows; found ' + bowRows.length + '.');
      return;
    }

    pass(label + ' retains G2_MATH_DEFAULT and 10 protected BOW rows.');
  });
}

function formatSupportRowLabel_(row) {
  return [
    row.GradeLevel || '(blank grade)',
    row.Subject || '(blank subject)',
    row.Term || '(blank term)'
  ].join(' / ');
}
