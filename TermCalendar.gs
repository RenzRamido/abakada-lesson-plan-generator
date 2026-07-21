function parseBowWeekRange_(value) {
  var text = String(value || '').trim();
  var normalized = text.replace(/[\u2013\u2014]/g, '-');
  var match = normalized.match(/^(?:weeks?\s+)?(\d+)(?:\s*(?:-|to)\s*(\d+))?$/i);
  if (!match) {
    return {
      valid: false,
      reason: 'WeekNumber must be a single week or one week range.'
    };
  }

  var start = Number(match[1]);
  var end = match[2] ? Number(match[2]) : start;
  if (
    !isFinite(start) ||
    !isFinite(end) ||
    Math.floor(start) !== start ||
    Math.floor(end) !== end ||
    start < 1 ||
    end < 1
  ) {
    return { valid: false, reason: 'Week values must be positive integers.' };
  }
  if (end < start) {
    return { valid: false, reason: 'WeekNumber range ends before it starts.' };
  }
  if (start > MAX_SUPPORTED_BOW_WEEK_ || end > MAX_SUPPORTED_BOW_WEEK_) {
    return {
      valid: false,
      reason: 'Week values must not exceed Week ' + MAX_SUPPORTED_BOW_WEEK_ + '.'
    };
  }

  return {
    valid: true,
    start: start,
    end: end,
    text: text
  };
}

function loadBowPacingMetadataRows_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAMES.BOW_PACING_METADATA);
  return sheet ? getSheetObjects_(sheet) : [];
}

function buildBowPacingMetadataIndex_(metadataRows) {
  var index = {};
  (metadataRows || []).forEach(function (row) {
    var bowId = String(row.BOW_ID || '').trim();
    if (!bowId) {
      return;
    }
    index[bowId] = index[bowId] || [];
    index[bowId].push(row);
  });
  return index;
}

function requirePositiveCalendarInteger_(value, fieldName, bowId) {
  var text = String(value === null || typeof value === 'undefined' ? '' : value).trim();
  if (!/^\d+$/.test(text) || Number(text) < 1) {
    throw createClassifiedError_(
      'Official pacing metadata for ' + bowId + ' has invalid ' + fieldName +
      '. Expected a positive integer, found "' + text + '".',
      'admin'
    );
  }
  return Number(text);
}

function resolveTermCalendar_(gradeLevel, subject, term, bowRecords, metadataRows) {
  var records = (bowRecords || []).slice();
  if (!records.length) {
    throw createClassifiedError_(
      'Cannot resolve a term calendar without BOW_DATABASE records for ' +
      [gradeLevel, subject, term].join(', ') + '.',
      'admin'
    );
  }

  var rows = typeof metadataRows === 'undefined'
    ? loadBowPacingMetadataRows_()
    : (metadataRows || []);
  var metadataIndex = buildBowPacingMetadataIndex_(rows);
  var matchedCount = 0;
  records.forEach(function (record) {
    if ((metadataIndex[String(record.BOW_ID || '').trim()] || []).length) {
      matchedCount += 1;
    }
  });

  if (!matchedCount) {
    var legacyMaxWeek = 0;
    records.forEach(function (record) {
      var parsed = parseBowWeekRange_(record.WeekNumber);
      if (!parsed.valid) {
        throw createClassifiedError_(
          'Invalid BOW WeekNumber for ' + (record.BOW_ID || '(blank BOW_ID)') +
          ': ' + parsed.reason,
          'admin'
        );
      }
      legacyMaxWeek = Math.max(legacyMaxWeek, parsed.end);
    });
    return {
      mode: 'legacy_global',
      totalTeachingDays: Number(getTermDayCount_(term)),
      maxOfficialWeek: legacyMaxWeek,
      fingerprint: '',
      orderedBowRecords: sortBowRecordsLegacy_(records),
      metadataByBowId: {}
    };
  }

  if (matchedCount !== records.length) {
    throw createClassifiedError_(
      'Official pacing metadata is partial for ' + [gradeLevel, subject, term].join(', ') +
      '. Found metadata for ' + matchedCount + ' of ' + records.length + ' selected BOW_ID values.',
      'admin'
    );
  }

  var resolved = records.map(function (record) {
    var bowId = String(record.BOW_ID || '').trim();
    var matches = metadataIndex[bowId] || [];
    if (matches.length !== 1) {
      throw createClassifiedError_(
        'Official pacing metadata must contain exactly one row for ' + bowId +
        '; found ' + matches.length + '.',
        'admin'
      );
    }

    var metadata = matches[0];
    if (normalizeForMatch_(metadata.PacingBasis) !== normalizeForMatch_(OFFICIAL_FIXED_PACING_BASIS_)) {
      throw createClassifiedError_(
        'Official pacing metadata for ' + bowId + ' must use PacingBasis "' +
        OFFICIAL_FIXED_PACING_BASIS_ + '".',
        'admin'
      );
    }
    ['OfficialWeekLabel', 'SourceFile', 'SourcePage'].forEach(function (fieldName) {
      if (!String(metadata[fieldName] || '').trim()) {
        throw createClassifiedError_(
          'Official pacing metadata for ' + bowId + ' has blank ' + fieldName + '.',
          'admin'
        );
      }
    });
    if (String(record.Notes || '').indexOf('ABAKADA-constructed weekly pacing') !== -1) {
      throw createClassifiedError_(
        'Official-fixed BOW record ' + bowId + ' contains the constructed-pacing marker.',
        'admin'
      );
    }

    var bowWeek = parseBowWeekRange_(record.WeekNumber);
    if (!bowWeek.valid) {
      throw createClassifiedError_('Invalid BOW WeekNumber for ' + bowId + ': ' + bowWeek.reason, 'admin');
    }
    var weekStart = requirePositiveCalendarInteger_(metadata.WeekStart, 'WeekStart', bowId);
    var weekEnd = requirePositiveCalendarInteger_(metadata.WeekEnd, 'WeekEnd', bowId);
    if (weekStart > MAX_SUPPORTED_BOW_WEEK_ || weekEnd > MAX_SUPPORTED_BOW_WEEK_) {
      throw createClassifiedError_(
        'Official pacing metadata for ' + bowId + ' exceeds Week ' + MAX_SUPPORTED_BOW_WEEK_ + '.',
        'admin'
      );
    }
    if (weekEnd < weekStart) {
      throw createClassifiedError_('Official pacing metadata for ' + bowId + ' ends before it starts.', 'admin');
    }
    if (bowWeek.start !== weekStart || bowWeek.end !== weekEnd) {
      throw createClassifiedError_(
        'Official pacing metadata week range does not match BOW_DATABASE WeekNumber for ' + bowId + '.',
        'admin'
      );
    }
    var officialLabelWeek = parseBowWeekRange_(metadata.OfficialWeekLabel);
    if (
      !officialLabelWeek.valid ||
      officialLabelWeek.start !== weekStart ||
      officialLabelWeek.end !== weekEnd
    ) {
      throw createClassifiedError_(
        'OfficialWeekLabel does not match WeekStart and WeekEnd for ' + bowId + '.',
        'admin'
      );
    }

    return {
      record: record,
      metadata: metadata,
      bowId: bowId,
      weekStart: weekStart,
      weekEnd: weekEnd,
      officialDayCount: requirePositiveCalendarInteger_(metadata.OfficialDayCount, 'OfficialDayCount', bowId),
      sourceOrder: requirePositiveCalendarInteger_(metadata.SourceOrder, 'SourceOrder', bowId)
    };
  });

  resolved.sort(function (a, b) { return a.sourceOrder - b.sourceOrder; });
  resolved.forEach(function (item, index) {
    var expected = index + 1;
    if (item.sourceOrder !== expected) {
      throw createClassifiedError_(
        'Official pacing SourceOrder for ' + [gradeLevel, subject, term].join(', ') +
        ' must be the exact contiguous sequence 1 through ' + resolved.length +
        '. Expected ' + expected + ', found ' + item.sourceOrder + ' for ' + item.bowId + '.',
        'admin'
      );
    }
  });

  var coveredWeeks = {};
  resolved.forEach(function (item) {
    for (var week = item.weekStart; week <= item.weekEnd; week++) {
      coveredWeeks[week] = true;
    }
  });
  var maximumCoveredWeek = resolved.reduce(function (maximum, item) {
    return Math.max(maximum, item.weekEnd);
  }, 0);
  var missingWeeks = [];
  for (var expectedWeek = 1; expectedWeek <= maximumCoveredWeek; expectedWeek++) {
    if (!coveredWeeks[expectedWeek]) {
      missingWeeks.push(expectedWeek);
    }
  }
  if (missingWeeks.length) {
    throw createClassifiedError_(
      'Official pacing metadata for ' + [gradeLevel, subject, term].join(', ') +
      ' does not continuously cover Week 1 through Week ' + maximumCoveredWeek +
      '. Missing week(s): ' + missingWeeks.join(', ') + '.',
      'admin'
    );
  }

  var metadataByBowId = {};
  var totalTeachingDays = 0;
  var maxOfficialWeek = 0;
  resolved.forEach(function (item) {
    metadataByBowId[item.bowId] = item;
    totalTeachingDays += item.officialDayCount;
    maxOfficialWeek = Math.max(maxOfficialWeek, item.weekEnd);
  });

  return {
    mode: 'official_fixed',
    totalTeachingDays: totalTeachingDays,
    maxOfficialWeek: maxOfficialWeek,
    fingerprint: buildOfficialCalendarFingerprint_(resolved),
    orderedBowRecords: resolved.map(function (item) { return item.record; }),
    metadataByBowId: metadataByBowId,
    resolvedItems: resolved
  };
}

function buildOfficialCalendarFingerprintPayload_(resolvedItems) {
  return JSON.stringify((resolvedItems || []).map(function (item) {
    return [
      item.bowId,
      item.weekStart,
      item.weekEnd,
      item.officialDayCount,
      item.sourceOrder
    ];
  }));
}

function buildOfficialCalendarFingerprint_(resolvedItems) {
  var payload = buildOfficialCalendarFingerprintPayload_(resolvedItems);
  var digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    payload,
    Utilities.Charset.UTF_8
  );
  return 'sha256:' + digest.map(function (value) {
    var unsigned = value < 0 ? value + 256 : value;
    return ('0' + unsigned.toString(16)).slice(-2);
  }).join('');
}

function assertJobCalendarSnapshot_(job, calendar) {
  var storedFingerprint = String(job.CalendarFingerprint || '').trim();
  var selected = [job.GradeLevel, job.Subject, job.Term].join(', ');

  if (calendar.mode === 'official_fixed') {
    if (!storedFingerprint) {
      throw createClassifiedError_(
        'Official-fixed job ' + job.JobID + ' has no immutable CalendarFingerprint snapshot for ' +
        selected + '. The job cannot continue or be backfilled automatically.',
        'admin'
      );
    }
    if (storedFingerprint !== calendar.fingerprint) {
      throw createClassifiedError_(
        'Official-fixed calendar fingerprint mismatch for job ' + job.JobID + ' (' + selected +
        '). Stored: ' + storedFingerprint + '. Current: ' + calendar.fingerprint +
        '. The job was stopped before generation continued.',
        'admin'
      );
    }
    if (Number(job.TotalTeachingDays) !== Number(calendar.totalTeachingDays)) {
      throw createClassifiedError_(
        'Official-fixed teaching-day snapshot mismatch for job ' + job.JobID + ' (' + selected +
        '). Stored: ' + job.TotalTeachingDays + '. Current: ' + calendar.totalTeachingDays + '.',
        'admin'
      );
    }
    return;
  }

  if (storedFingerprint) {
    throw createClassifiedError_(
      'Job ' + job.JobID + ' has a CalendarFingerprint but the current tuple resolves as legacy_global: ' +
      selected + '. The job was stopped because official pacing metadata may have been removed.',
      'admin'
    );
  }
}

function buildOfficialFixedCoverageGroups_(calendar) {
  if (!calendar || calendar.mode !== 'official_fixed') {
    throw createClassifiedError_('Official fixed coverage requires an official_fixed calendar.', 'validation');
  }

  var groups = [];
  (calendar.resolvedItems || []).forEach(function (item) {
    for (var day = 0; day < item.officialDayCount; day++) {
      groups.push({
        dayNumber: groups.length + 1,
        bowIds: [item.bowId],
        weekNumber: String(item.record.WeekNumber || '').trim()
      });
    }
  });

  if (groups.length !== Number(calendar.totalTeachingDays)) {
    throw createClassifiedError_('Official fixed coverage day count does not match its calendar.', 'validation');
  }
  return groups;
}

function getOfficialWeekLabelForBow_(record, calendar) {
  if (!calendar || calendar.mode !== 'official_fixed') {
    return String(record.WeekNumber || '').trim();
  }
  var item = calendar.metadataByBowId[String(record.BOW_ID || '').trim()];
  return item && String(item.metadata.OfficialWeekLabel || '').trim()
    ? String(item.metadata.OfficialWeekLabel).trim()
    : String(record.WeekNumber || '').trim();
}

function getBowDisplayWeekLabel_(record, metadataIndex) {
  var bowId = String(record && record.BOW_ID || '').trim();
  if (!bowId) {
    return String(record && record.WeekNumber || '').trim();
  }
  var index = metadataIndex || buildBowPacingMetadataIndex_(loadBowPacingMetadataRows_());
  var matches = index[bowId] || [];
  if (
    matches.length === 1 &&
    normalizeForMatch_(matches[0].PacingBasis) === normalizeForMatch_(OFFICIAL_FIXED_PACING_BASIS_) &&
    String(matches[0].OfficialWeekLabel || '').trim()
  ) {
    return String(matches[0].OfficialWeekLabel).trim();
  }
  return String(record.WeekNumber || '').trim();
}

function formatOfficialWeekRange_(calendar) {
  return calendar && calendar.mode === 'official_fixed'
    ? 'Week 1 to Week ' + calendar.maxOfficialWeek
    : '';
}
