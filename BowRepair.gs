var ENGLISH_T1_REPAIR_TARGET_GRADES_ = ['Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
var ENGLISH_T1_REPAIR_SUBJECT_ = 'English';
var ENGLISH_T1_REPAIR_TERM_ = 'First Term';
var ENGLISH_T1_REPAIR_CONSTRUCTED_DOMAIN_ =
  'ABAKADA-constructed review domain (teacher review required)';
var ENGLISH_T1_REPAIR_NOTE_ =
  'English First Term repair: Domain was blank in imported review data; set to ABAKADA-constructed review domain label, not official DepEd wording; needs teacher review.';
var ENGLISH_T1_REPAIR_AUDIT_SHEET_ = 'BOW_DATABASE_AUDIT';
var ENGLISH_T1_REPAIR_AUDIT_HEADERS_ = [
  'BOW_ID',
  'SourceFile',
  'SourcePage',
  'ExtractionNotes',
  'ImportBatch',
  'ImportedAt'
];

function dryRunEnglishFirstTermBowRepair() {
  var report = buildEnglishFirstTermBowRepairPlan_();
  Logger.log(report.text);
  SpreadsheetApp.getUi().alert(report.text);
  return report;
}

function commitEnglishFirstTermBowRepair() {
  var initialReport = buildEnglishFirstTermBowRepairPlan_();
  if (!initialReport.valid) {
    throw new Error(
      'English First Term BOW repair dry run failed:\n' +
      initialReport.errors.join('\n')
    );
  }

  var ui = SpreadsheetApp.getUi();
  var confirmation = ui.alert(
    'Commit English First Term BOW repair?',
    initialReport.text +
    '\n\nThis will update only Grade 2-6 English First Term BOW rows and append repair audit rows. It will not activate SUPPORT_MATRIX.',
    ui.ButtonSet.YES_NO
  );
  if (confirmation !== ui.Button.YES) {
    return { committed: false, reason: 'Cancelled by user.' };
  }

  var result = withScriptLock_(function () {
    var report = buildEnglishFirstTermBowRepairPlan_();
    if (!report.valid) {
      throw new Error(
        'English First Term BOW repair dry run failed after acquiring the script lock:\n' +
        report.errors.join('\n')
      );
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var bowSheet = requireExistingSheet_(spreadsheet, SHEET_NAMES.BOW_DATABASE);
    var auditSheet = requireExistingSheet_(spreadsheet, ENGLISH_T1_REPAIR_AUDIT_SHEET_);
    assertExactSheetHeaders_(
      auditSheet,
      ENGLISH_T1_REPAIR_AUDIT_HEADERS_,
      ENGLISH_T1_REPAIR_AUDIT_SHEET_
    );

    var timestamp = Utilities.formatDate(
      now_(),
      Session.getScriptTimeZone(),
      'yyyyMMdd_HHmmss'
    );
    var importBatch = 'ENGLISH_T1_REPAIR_' + timestamp;
    var bowBackup = createImportBackupSheet_(
      spreadsheet,
      bowSheet,
      'BOW_DATABASE_BACKUP_ENGLISH_T1_REPAIR_' + timestamp
    );
    var auditBackup = createImportBackupSheet_(
      spreadsheet,
      auditSheet,
      'BOW_AUDIT_BACKUP_ENGLISH_T1_REPAIR_' + timestamp
    );
    var beforeState = captureEnglishFirstTermRepairState_(
      spreadsheet,
      bowSheet,
      auditSheet
    );

    try {
      applyEnglishFirstTermBowRepair_(bowSheet, report);
      appendEnglishFirstTermRepairAuditRows_(
        auditSheet,
        report.changedRows,
        importBatch
      );
      SpreadsheetApp.flush();

      var validation = validateCommittedEnglishFirstTermRepair_({
        spreadsheet: spreadsheet,
        bowSheet: bowSheet,
        auditSheet: auditSheet,
        report: report,
        importBatch: importBatch,
        beforeState: beforeState
      });
      if (!validation.valid) {
        throw new Error(
          'Post-repair validation failed:\n' + validation.errors.join('\n')
        );
      }

      return {
        committed: true,
        importBatch: importBatch,
        changedRows: report.changedRows.length,
        bowBackupSheet: bowBackup.getName(),
        auditBackupSheet: auditBackup.getName(),
        validationText: validation.text
      };
    } catch (err) {
      restoreSheetFromImportBackup_(bowSheet, bowBackup);
      restoreSheetFromImportBackup_(auditSheet, auditBackup);
      SpreadsheetApp.flush();
      throw new Error(
        'English First Term BOW repair was rolled back. Backup sheets were retained. ' +
        (err && err.message ? err.message : String(err))
      );
    }
  }, 30000);

  ui.alert(
    'English First Term BOW repair completed.\n\n' +
    'Batch: ' + result.importBatch + '\n' +
    'Changed BOW rows: ' + result.changedRows + '\n' +
    'BOW backup: ' + result.bowBackupSheet + '\n' +
    'Audit backup: ' + result.auditBackupSheet + '\n\n' +
    result.validationText
  );
  return result;
}

function buildEnglishFirstTermBowRepairPlan_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var errors = [];
  var warnings = [];
  var bowSheet = spreadsheet.getSheetByName(SHEET_NAMES.BOW_DATABASE);
  var supportSheet = spreadsheet.getSheetByName(SHEET_NAMES.SUPPORT_MATRIX);
  var auditSheet = spreadsheet.getSheetByName(ENGLISH_T1_REPAIR_AUDIT_SHEET_);

  if (!bowSheet) {
    errors.push('Missing required sheet: ' + SHEET_NAMES.BOW_DATABASE + '.');
  }
  if (!supportSheet) {
    errors.push('Missing required sheet: ' + SHEET_NAMES.SUPPORT_MATRIX + '.');
  }
  if (!auditSheet) {
    errors.push('Missing required sheet: ' + ENGLISH_T1_REPAIR_AUDIT_SHEET_ + '.');
  }

  if (bowSheet) {
    try {
      assertRequiredHeaders_(bowSheet, BOW_HEADERS, SHEET_NAMES.BOW_DATABASE);
    } catch (err) {
      errors.push(err.message);
    }
  }
  if (auditSheet) {
    try {
      assertExactSheetHeaders_(
        auditSheet,
        ENGLISH_T1_REPAIR_AUDIT_HEADERS_,
        ENGLISH_T1_REPAIR_AUDIT_SHEET_
      );
    } catch (err) {
      errors.push(err.message);
    }
  }

  var supportStatus = supportSheet
    ? validateEnglishFirstTermSupportInactive_(supportSheet, errors)
    : [];
  var tuples = bowSheet
    ? buildEnglishFirstTermRepairTuples_(bowSheet, errors, warnings)
    : [];
  var changedRows = buildEnglishFirstTermChangedRows_(tuples);

  return createEnglishFirstTermRepairReport_(
    errors,
    warnings,
    supportStatus,
    tuples,
    changedRows
  );
}

function validateEnglishFirstTermSupportInactive_(supportSheet, errors) {
  var rowsByKey = {};
  getSheetObjects_(supportSheet).forEach(function (row) {
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    rowsByKey[key] = rowsByKey[key] || [];
    rowsByKey[key].push(row);
  });

  return ENGLISH_T1_REPAIR_TARGET_GRADES_.map(function (gradeLevel) {
    var key = supportMatrixKey_(
      gradeLevel,
      ENGLISH_T1_REPAIR_SUBJECT_,
      ENGLISH_T1_REPAIR_TERM_
    );
    var rows = rowsByKey[key] || [];
    var activeRows = rows.filter(function (row) {
      return normalizeForMatch_(row.Status) === 'active' && isTruthyFlag_(row.Active);
    });

    if (!rows.length) {
      errors.push(
        gradeLevel +
        ' / English / First Term has no SUPPORT_MATRIX row to verify inactive repair readiness.'
      );
    }
    if (rows.length > 1) {
      errors.push(
        gradeLevel +
        ' / English / First Term has duplicate SUPPORT_MATRIX rows: ' +
        rows.length + '.'
      );
    }
    if (activeRows.length) {
      errors.push(
        gradeLevel +
        ' / English / First Term is still active in SUPPORT_MATRIX. Set it inactive before repair commit readiness.'
      );
    }

    return {
      gradeLevel: gradeLevel,
      supportRows: rows.length,
      activeRows: activeRows.length
    };
  });
}

function buildEnglishFirstTermRepairTuples_(bowSheet, errors, warnings) {
  var targetGradeSet = {};
  ENGLISH_T1_REPAIR_TARGET_GRADES_.forEach(function (gradeLevel) {
    targetGradeSet[normalizeForMatch_(gradeLevel)] = true;
  });

  var tuplesByGrade = {};
  ENGLISH_T1_REPAIR_TARGET_GRADES_.forEach(function (gradeLevel) {
    tuplesByGrade[gradeLevel] = [];
  });

  getSheetObjects_(bowSheet).forEach(function (row) {
    var gradeKey = normalizeForMatch_(row.GradeLevel);
    var subjectKey = normalizeForMatch_(row.Subject);
    var termKey = normalizeForMatch_(row.Term);

    if (
      gradeKey === 'grade 2' &&
      subjectKey === 'english' &&
      normalizeForMatch_(row.Term) === 'second term'
    ) {
      row._isProtectedSupplement = true;
    }

    if (
      targetGradeSet[gradeKey] &&
      subjectKey === normalizeForMatch_(ENGLISH_T1_REPAIR_SUBJECT_) &&
      termKey === normalizeForMatch_(ENGLISH_T1_REPAIR_TERM_)
    ) {
      tuplesByGrade[String(row.GradeLevel || '').trim()].push(row);
    }
  });

  return ENGLISH_T1_REPAIR_TARGET_GRADES_.map(function (gradeLevel) {
    var rows = tuplesByGrade[gradeLevel] || [];
    if (!rows.length) {
      errors.push(gradeLevel + ' / English / First Term has no BOW_DATABASE rows.');
    }
    return buildEnglishFirstTermTupleRepairPlan_(gradeLevel, rows, errors, warnings);
  });
}

function buildEnglishFirstTermTupleRepairPlan_(gradeLevel, rows, errors, warnings) {
  var seenIds = {};
  var duplicateIds = [];
  var currentOrder = rows.map(function (row) {
    return String(row.BOW_ID || '').trim();
  });
  var rowPlans = rows.map(function (row) {
    var parsed = parseEnglishFirstTermBowId_(row.BOW_ID);
    var week = parseEnglishFirstTermWeek_(row.WeekNumber);
    var domainPlan = buildEnglishFirstTermDomainRepairPlan_(row, rows);
    var expectedPattern = /^BOW-G(2|3|4|5|6)-ENG-T1-W(10|[1-9])(?:-[A-Z])?$/;
    var bowId = String(row.BOW_ID || '').trim();
    var bowIdKey = normalizeForMatch_(bowId);

    if (!expectedPattern.test(bowId)) {
      errors.push(
        gradeLevel + ' / English / First Term has unexpected BOW_ID pattern: ' +
        (bowId || '(blank BOW_ID)') + '.'
      );
    }
    if (bowIdKey) {
      if (seenIds[bowIdKey]) {
        duplicateIds.push(bowId);
      }
      seenIds[bowIdKey] = true;
    }
    if (!parsed.valid) {
      errors.push(bowId + ' could not be parsed for English First Term repair.');
    }
    if (!week.valid) {
      errors.push(bowId + ' has invalid WeekNumber: ' + row.WeekNumber + '.');
    }
    if (parsed.valid && week.valid && parsed.week !== week.week) {
      errors.push(
        bowId + ' has true BOW_ID/WeekNumber conflict: BOW_ID week ' +
        parsed.week + ', WeekNumber ' + row.WeekNumber + '.'
      );
    }
    if (
      normalizeForMatch_(row.GradeLevel) === 'grade 2' &&
      normalizeForMatch_(row.Subject) === 'english' &&
      normalizeForMatch_(row.Term) === 'second term'
    ) {
      errors.push('Grade 2 English Second Term supplement row would be targeted: ' + bowId + '.');
    }
    if (!domainPlan.currentDomain && domainPlan.source === 'constructed') {
      warnings.push(bowId + ' requires constructed review Domain label.');
    }

    return {
      rowNumber: row._rowNumber,
      original: row,
      parsed: parsed,
      week: week,
      domainPlan: domainPlan
    };
  });

  if (duplicateIds.length) {
    errors.push(
      gradeLevel + ' / English / First Term has duplicate BOW_ID values: ' +
      duplicateIds.join(', ') + '.'
    );
  }

  var sortedPlans = rowPlans.slice().sort(compareEnglishFirstTermRowPlans_);
  var proposedOrder = sortedPlans.map(function (plan) {
    return String(plan.original.BOW_ID || '').trim();
  });
  var sortedSlots = rowPlans.map(function (plan) {
    return plan.rowNumber;
  }).sort(function (a, b) {
    return a - b;
  });

  return {
    gradeLevel: gradeLevel,
    rows: rows,
    rowPlans: rowPlans,
    sortedPlans: sortedPlans,
    rowSlots: sortedSlots,
    currentOrder: currentOrder,
    proposedOrder: proposedOrder,
    orderChanges: currentOrder.join('\u001f') !== proposedOrder.join('\u001f'),
    blankDomainCount: rowPlans.filter(function (plan) {
      return !plan.domainPlan.currentDomain;
    }).length
  };
}

function buildEnglishFirstTermDomainRepairPlan_(row, tupleRows) {
  var currentDomain = String(row.Domain || '').trim();
  if (currentDomain) {
    return {
      currentDomain: currentDomain,
      proposedDomain: currentDomain,
      source: 'unchanged',
      evidence: 'Existing Domain is nonblank.'
    };
  }

  var week = String(row.WeekNumber || '').trim();
  var sameWeekDomains = getDistinctEnglishRepairDomains_(
    tupleRows.filter(function (candidate) {
      return String(candidate.WeekNumber || '').trim() === week;
    })
  );
  if (sameWeekDomains.length === 1) {
    return {
      currentDomain: '',
      proposedDomain: sameWeekDomains[0],
      source: 'same-week',
      evidence: 'Derived from same tuple and same WeekNumber ' + week + '.'
    };
  }

  var tupleDomains = getDistinctEnglishRepairDomains_(tupleRows);
  if (tupleDomains.length === 1) {
    return {
      currentDomain: '',
      proposedDomain: tupleDomains[0],
      source: 'same-tuple',
      evidence: 'Derived from the only nonblank Domain in the same grade/term tuple.'
    };
  }

  return {
    currentDomain: '',
    proposedDomain: ENGLISH_T1_REPAIR_CONSTRUCTED_DOMAIN_,
    source: 'constructed',
    evidence: 'No unambiguous same-tuple Domain evidence found.'
  };
}

function getDistinctEnglishRepairDomains_(rows) {
  var seen = {};
  var domains = [];
  (rows || []).forEach(function (row) {
    var domain = String(row.Domain || '').trim();
    var key = normalizeForMatch_(domain);
    if (domain && !seen[key]) {
      seen[key] = true;
      domains.push(domain);
    }
  });
  return domains;
}

function compareEnglishFirstTermRowPlans_(a, b) {
  var weekA = a.parsed.valid ? a.parsed.week : 9999;
  var weekB = b.parsed.valid ? b.parsed.week : 9999;
  if (weekA !== weekB) {
    return weekA - weekB;
  }
  if (a.parsed.suffixRank !== b.parsed.suffixRank) {
    return a.parsed.suffixRank - b.parsed.suffixRank;
  }
  return String(a.original.BOW_ID || '').localeCompare(String(b.original.BOW_ID || ''));
}

function parseEnglishFirstTermBowId_(bowId) {
  var text = String(bowId || '').trim();
  var match = text.match(/^BOW-G(2|3|4|5|6)-ENG-T1-W(10|[1-9])(?:-([A-Z]))?$/);
  if (!match) {
    return { valid: false, week: null, suffix: '', suffixRank: 9999 };
  }
  var suffix = match[3] || '';
  return {
    valid: true,
    week: Number(match[2]),
    suffix: suffix,
    suffixRank: suffix ? suffix.charCodeAt(0) - 64 : 0
  };
}

function parseEnglishFirstTermWeek_(weekNumber) {
  var text = String(weekNumber || '').trim();
  if (!/^\d+$/.test(text)) {
    return { valid: false, week: null };
  }
  var week = Number(text);
  return {
    valid: week >= 1 && week <= 10,
    week: week
  };
}

function buildEnglishFirstTermChangedRows_(tuples) {
  var changed = [];
  (tuples || []).forEach(function (tuple) {
    tuple.rowSlots.forEach(function (rowNumber, index) {
      var sourcePlan = tuple.sortedPlans[index];
      if (!sourcePlan) {
        return;
      }
      var repaired = buildEnglishFirstTermRepairedRow_(sourcePlan.original, sourcePlan.domainPlan);
      var originalAtSlot = tuple.rowPlans.filter(function (plan) {
        return plan.rowNumber === rowNumber;
      })[0];
      if (
        !originalAtSlot ||
        normalizeEnglishFirstTermRowForCompare_(originalAtSlot.original) !==
          normalizeEnglishFirstTermRowForCompare_(repaired)
      ) {
        changed.push({
          rowNumber: rowNumber,
          sourceRowNumber: sourcePlan.rowNumber,
          before: originalAtSlot ? originalAtSlot.original : null,
          after: repaired,
          domainSource: sourcePlan.domainPlan.source,
          domainEvidence: sourcePlan.domainPlan.evidence
        });
      }
    });
  });
  return changed;
}

function buildEnglishFirstTermRepairedRow_(row, domainPlan) {
  var repaired = {};
  BOW_HEADERS.forEach(function (header) {
    repaired[header] = row[header];
  });
  repaired.Domain = domainPlan.proposedDomain;
  if (domainPlan.source === 'constructed') {
    repaired.Notes = appendEnglishFirstTermRepairNote_(repaired.Notes);
  }
  return repaired;
}

function appendEnglishFirstTermRepairNote_(notes) {
  var text = String(notes || '').trim();
  if (text.indexOf(ENGLISH_T1_REPAIR_NOTE_) !== -1) {
    return text;
  }
  return text ? text + ' ' + ENGLISH_T1_REPAIR_NOTE_ : ENGLISH_T1_REPAIR_NOTE_;
}

function normalizeEnglishFirstTermRowForCompare_(row) {
  return BOW_HEADERS.map(function (header) {
    return normalizeImportCell_(row ? row[header] : '');
  }).join('\u001f');
}

function applyEnglishFirstTermBowRepair_(bowSheet, report) {
  var headerMap = getHeaderMap_(bowSheet);
  (report.changedRows || []).forEach(function (change) {
    var values = bowSheet.getRange(
      change.rowNumber,
      1,
      1,
      bowSheet.getLastColumn()
    ).getValues()[0];
    BOW_HEADERS.forEach(function (header) {
      values[headerMap[header] - 1] = change.after[header] || '';
    });
    bowSheet.getRange(change.rowNumber, 1, 1, values.length).setValues([values]);
  });
}

function appendEnglishFirstTermRepairAuditRows_(auditSheet, changedRows, importBatch) {
  var importedAt = now_();
  var values = (changedRows || []).map(function (change) {
    return [
      change.after.BOW_ID,
      change.after.SourceFile,
      change.after.SourcePage,
      [
        'English First Term BOW repair.',
        'Target row: ' + change.rowNumber + '.',
        'Source row before reorder: ' + change.sourceRowNumber + '.',
        'Domain source: ' + change.domainSource + '.',
        'Evidence: ' + change.domainEvidence
      ].join(' '),
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

function captureEnglishFirstTermRepairState_(spreadsheet, bowSheet, auditSheet) {
  var bowRows = bowSheet.getDataRange().getValues();
  var auditRows = auditSheet.getDataRange().getValues();
  return {
    bowRows: bowRows,
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

function validateCommittedEnglishFirstTermRepair_(context) {
  var errors = [];
  var before = context.beforeState;
  var report = context.report;
  var bowSheet = context.bowSheet;
  var auditSheet = context.auditSheet;

  validateEnglishFirstTermNonTargetBowRowsUnchanged_(bowSheet, before, report, errors);
  validateEnglishFirstTermRepairTargetRows_(bowSheet, report, errors);
  validateEnglishFirstTermRepairAuditRows_(
    auditSheet,
    context.importBatch,
    report.changedRows.length,
    errors
  );

  var existingAuditChecksumAfter = checksumValues_(
    auditSheet.getRange(
      1,
      1,
      before.auditRegionRows,
      before.auditRegionColumns
    ).getValues()
  );
  if (existingAuditChecksumAfter !== before.auditChecksum) {
    errors.push('Pre-existing BOW_DATABASE_AUDIT rows changed during English First Term repair.');
  }
  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUPPORT_MATRIX)
    ) !== before.supportChecksum
  ) {
    errors.push('SUPPORT_MATRIX changed during English First Term repair.');
  }
  if (
    checksumSheetData_(
      requireExistingSheet_(context.spreadsheet, SHEET_NAMES.SUBJECT_PROFILES)
    ) !== before.profileChecksum
  ) {
    errors.push('SUBJECT_PROFILES changed during English First Term repair.');
  }

  return createEnglishFirstTermRepairValidationReport_(
    errors,
    report.changedRows.length
  );
}

function validateEnglishFirstTermNonTargetBowRowsUnchanged_(bowSheet, before, report, errors) {
  var afterRows = bowSheet.getDataRange().getValues();
  if (
    afterRows.length !== before.bowRegionRows ||
    (afterRows[0] ? afterRows[0].length : 1) !== before.bowRegionColumns
  ) {
    errors.push('BOW_DATABASE dimensions changed during English First Term repair.');
    return;
  }

  var targetRows = {};
  (report.tuples || []).forEach(function (tuple) {
    (tuple.rowSlots || []).forEach(function (rowNumber) {
      targetRows[rowNumber] = true;
    });
  });

  for (var r = 1; r <= before.bowRegionRows; r++) {
    if (targetRows[r]) {
      continue;
    }
    var beforeRow = before.bowRows[r - 1] || [];
    var afterRow = afterRows[r - 1] || [];
    if (checksumValues_([beforeRow]) !== checksumValues_([afterRow])) {
      errors.push('Non-target BOW_DATABASE row changed during English First Term repair: row ' + r + '.');
      return;
    }
  }
}

function validateEnglishFirstTermRepairTargetRows_(bowSheet, report, errors) {
  var byRowNumber = {};
  getSheetObjects_(bowSheet).forEach(function (row) {
    byRowNumber[row._rowNumber] = row;
  });

  var beforeIds = [];
  var afterIds = [];
  (report.tuples || []).forEach(function (tuple) {
    tuple.rowPlans.forEach(function (plan) {
      beforeIds.push(String(plan.original.BOW_ID || '').trim());
    });
    tuple.rowSlots.forEach(function (rowNumber) {
      var row = byRowNumber[rowNumber];
      if (row) {
        afterIds.push(String(row.BOW_ID || '').trim());
      }
    });
  });
  if (beforeIds.sort().join('\u001f') !== afterIds.sort().join('\u001f')) {
    errors.push('Target BOW_ID set changed during English First Term repair.');
  }

  (report.tuples || []).forEach(function (tuple) {
    var previousWeek = null;
    tuple.rowSlots.forEach(function (rowNumber) {
      var row = byRowNumber[rowNumber];
      if (!row) {
        errors.push('Missing repaired BOW row at row ' + rowNumber + '.');
        return;
      }
      BOW_HEADERS.filter(function (header) {
        return header !== 'Notes';
      }).forEach(function (header) {
        if (!String(row[header] || '').trim()) {
          errors.push(row.BOW_ID + ' still has blank required field ' + header + '.');
        }
      });
      var parsed = parseEnglishFirstTermWeek_(row.WeekNumber);
      if (!parsed.valid) {
        errors.push(row.BOW_ID + ' has invalid repaired WeekNumber ' + row.WeekNumber + '.');
        return;
      }
      if (previousWeek !== null && parsed.week < previousWeek) {
        errors.push(row.BOW_ID + ' repaired week order moves backward.');
      }
      previousWeek = parsed.week;
    });
  });
}

function validateEnglishFirstTermRepairAuditRows_(
  auditSheet,
  importBatch,
  expectedCount,
  errors
) {
  var matchingRows = getSheetObjects_(auditSheet).filter(function (row) {
    return String(row.ImportBatch || '') === importBatch;
  });
  if (matchingRows.length !== expectedCount) {
    errors.push(
      'Repair audit batch ' + importBatch + ' contains ' +
      matchingRows.length + ' row(s), expected ' + expectedCount + '.'
    );
  }
}

function createEnglishFirstTermRepairValidationReport_(errors, changedRows) {
  var valid = errors.length === 0;
  var lines = [
    valid
      ? 'English First Term BOW repair validation passed.'
      : 'English First Term BOW repair validation failed.',
    'Changed BOW rows: ' + changedRows,
    'SUPPORT_MATRIX changes: 0',
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

function createEnglishFirstTermRepairReport_(
  errors,
  warnings,
  supportStatus,
  tuples,
  changedRows
) {
  var valid = errors.length === 0;
  var lines = [
    valid
      ? 'English First Term BOW repair dry run passed.'
      : 'English First Term BOW repair dry run failed.',
    'Target tuples: Grade 2-6 / English / First Term',
    'Changed BOW row slots proposed: ' + changedRows.length,
    'Validation errors: ' + errors.length,
    'Warnings: ' + warnings.length,
    ''
  ];

  (supportStatus || []).forEach(function (status) {
    lines.push(
      status.gradeLevel +
      ' support rows: ' + status.supportRows +
      ', active rows: ' + status.activeRows
    );
  });
  lines.push('');

  (tuples || []).forEach(function (tuple) {
    lines.push(
      tuple.gradeLevel +
      ' / English / First Term | rows: ' + tuple.rows.length +
      ' | blank Domain rows: ' + tuple.blankDomainCount +
      ' | order repair needed: ' + (tuple.orderChanges ? 'Yes' : 'No')
    );
    lines.push('Current order: ' + tuple.currentOrder.join(' -> '));
    lines.push('Proposed order: ' + tuple.proposedOrder.join(' -> '));
    tuple.rowPlans.forEach(function (plan) {
      lines.push(
        'Row ' + plan.rowNumber +
        ' | ' + (plan.original.BOW_ID || '') +
        ' | WeekNumber: ' + (plan.original.WeekNumber || '') +
        ' | Domain: ' + (plan.original.Domain || '(blank)') +
        ' | SourceFile: ' + (plan.original.SourceFile || '') +
        ' | SourcePage: ' + (plan.original.SourcePage || '') +
        ' | Notes: ' + (plan.original.Notes || '') +
        ' | BOW_ID week matches WeekNumber: ' +
        (plan.parsed.valid && plan.week.valid && plan.parsed.week === plan.week.week ? 'Yes' : 'No')
      );
      if (!plan.domainPlan.currentDomain) {
        lines.push(
          '  Proposed Domain: ' + plan.domainPlan.proposedDomain +
          ' | Evidence: ' + plan.domainPlan.evidence
        );
      }
    });
    lines.push('');
  });

  if (warnings.length) {
    lines.push('Warnings:', warnings.slice(0, 20).join('\n'), '');
  }
  if (errors.length) {
    lines.push('Errors:', errors.slice(0, 20).join('\n'));
    if (errors.length > 20) {
      lines.push('Additional errors omitted: ' + (errors.length - 20) + '.');
    }
  }

  return {
    valid: valid,
    errors: errors,
    warnings: warnings,
    supportStatus: supportStatus,
    tuples: tuples,
    changedRows: changedRows,
    text: lines.join('\n')
  };
}
