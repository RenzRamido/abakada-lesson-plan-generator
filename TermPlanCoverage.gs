function parseCoveredBowIds_(value, primaryBowId) {
  var primary = String(primaryBowId || '').trim();
  var parsed;

  if (Array.isArray(value)) {
    parsed = value;
  } else {
    var text = String(value || '').trim();
    if (!text) {
      return primary ? [primary] : [];
    }
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      throw createClassifiedError_('CoveredBOW_IDs must be a valid JSON array.', 'validation');
    }
  }

  if (!Array.isArray(parsed)) {
    throw createClassifiedError_('CoveredBOW_IDs must be a JSON array.', 'validation');
  }

  var ids = parsed.map(function (bowId) {
    return String(bowId || '').trim();
  });
  if (!ids.length || ids.some(function (bowId) { return !bowId; })) {
    throw createClassifiedError_('CoveredBOW_IDs must contain at least one nonblank BOW_ID.', 'validation');
  }
  return ids;
}

function serializeCoveredBowIds_(bowIds) {
  return JSON.stringify((bowIds || []).map(function (bowId) {
    return String(bowId || '').trim();
  }));
}

function getCoveredBowIdsForDay_(dayPlan) {
  var primary = dayPlan && (dayPlan.BOW_ID || dayPlan.bowId);
  var stored = dayPlan && Object.prototype.hasOwnProperty.call(dayPlan, 'CoveredBOW_IDs')
    ? dayPlan.CoveredBOW_IDs
    : dayPlan && dayPlan.coveredBowIds;
  return parseCoveredBowIds_(stored, primary);
}

function getCoveredBowRecordsForDay_(dayPlan, bowRecords) {
  var bowMap = buildBowMapForTerm_(bowRecords);
  return getCoveredBowIdsForDay_(dayPlan).map(function (bowId) {
    var entry = bowMap[bowId];
    if (!entry) {
      throw createClassifiedError_(
        'Missing selected-term BOW_DATABASE record for covered BOW_ID ' + bowId + '.',
        'validation'
      );
    }
    return entry.record;
  });
}

function buildDenseBowCoverageGroups_(bowRecords, totalDays) {
  var records = bowRecords || [];
  var dayCount = Number(totalDays || 0);
  if (!dayCount || records.length <= dayCount) {
    throw createClassifiedError_(
      'Dense BOW coverage requires more BOW records than teaching days.',
      'validation'
    );
  }

  var buckets = [];
  records.forEach(function (record) {
    var weekKey = normalizeForMatch_(record.WeekNumber);
    var lastBucket = buckets.length ? buckets[buckets.length - 1] : null;
    if (!lastBucket || lastBucket.weekKey !== weekKey) {
      lastBucket = {
        weekKey: weekKey,
        weekNumber: String(record.WeekNumber || '').trim(),
        records: [],
        slots: 1
      };
      buckets.push(lastBucket);
    }
    lastBucket.records.push(record);
  });

  if (buckets.length > dayCount) {
    throw createClassifiedError_(
      'Dense BOW coverage has ' + buckets.length +
      ' ordered WeekNumber buckets but only ' + dayCount + ' teaching days.',
      'validation'
    );
  }

  var remainingSlots = dayCount - buckets.length;
  while (remainingSlots > 0) {
    var candidates = buckets.filter(function (bucket) {
      return bucket.slots < bucket.records.length;
    });
    if (!candidates.length) {
      throw createClassifiedError_('Unable to allocate all dense BOW teaching-day slots safely.', 'validation');
    }
    candidates.sort(function (a, b) {
      var aRatio = a.slots / a.records.length;
      var bRatio = b.slots / b.records.length;
      if (aRatio !== bRatio) {
        return aRatio - bRatio;
      }
      return buckets.indexOf(a) - buckets.indexOf(b);
    });
    candidates[0].slots += 1;
    remainingSlots -= 1;
  }

  var groups = [];
  buckets.forEach(function (bucket) {
    for (var slot = 0; slot < bucket.slots; slot++) {
      var start = Math.floor((slot * bucket.records.length) / bucket.slots);
      var end = Math.floor(((slot + 1) * bucket.records.length) / bucket.slots);
      var ids = bucket.records.slice(start, end).map(function (record) {
        return String(record.BOW_ID || '').trim();
      });
      if (!ids.length) {
        throw createClassifiedError_('Dense BOW allocation produced an empty teaching day.', 'validation');
      }
      groups.push({
        dayNumber: groups.length + 1,
        bowIds: ids,
        weekNumber: bucket.weekNumber
      });
    }
  });

  if (groups.length !== dayCount) {
    throw createClassifiedError_(
      'Dense BOW allocation produced ' + groups.length +
      ' day groups; expected ' + dayCount + '.',
      'validation'
    );
  }
  return groups;
}

function buildFeasibleCoverageRepair_(days, bowRecords, totalDays) {
  var records = bowRecords || [];
  var dayCount = Number(totalDays || 0);
  if (records.length > dayCount) {
    throw createClassifiedError_('Feasible coverage repair cannot be used when BOW records exceed teaching days.', 'validation');
  }

  var bowMap = buildBowMapForTerm_(records);
  var counts = records.map(function () { return 0; });
  var originalIds = (days || []).map(function (day) {
    var bowId = String(day.bowId || day.BOW_ID || '').trim();
    if (!bowMap[bowId]) {
      throw createClassifiedError_('Cannot repair unsupported BOW_ID: ' + bowId + '.', 'validation');
    }
    counts[bowMap[bowId].index] += 1;
    return bowId;
  });

  if (originalIds.length !== dayCount) {
    throw createClassifiedError_(
      'Cannot repair coverage because the candidate day count is not ' + dayCount + '.',
      'validation'
    );
  }

  var missingIndexes = [];
  counts.forEach(function (count, index) {
    if (!count) {
      missingIndexes.push(index);
    }
  });

  missingIndexes.forEach(function (missingIndex) {
    var missingWeek = normalizeForMatch_(records[missingIndex].WeekNumber);
    var donors = [];
    counts.forEach(function (count, donorIndex) {
      if (count > 1) {
        donors.push({
          index: donorIndex,
          sameWeek: normalizeForMatch_(records[donorIndex].WeekNumber) === missingWeek,
          distance: Math.abs(donorIndex - missingIndex)
        });
      }
    });
    donors.sort(function (a, b) {
      if (a.sameWeek !== b.sameWeek) {
        return a.sameWeek ? -1 : 1;
      }
      if (a.distance !== b.distance) {
        return a.distance - b.distance;
      }
      return a.index - b.index;
    });
    if (!donors.length) {
      throw createClassifiedError_(
        'No surplus repeated BOW assignment is available to restore ' +
        records[missingIndex].BOW_ID + ' without dropping another required BOW_ID.',
        'validation'
      );
    }
    counts[donors[0].index] -= 1;
    counts[missingIndex] = 1;
  });

  var repairedIds = [];
  counts.forEach(function (count, index) {
    for (var repeat = 0; repeat < count; repeat++) {
      repairedIds.push(String(records[index].BOW_ID || '').trim());
    }
  });

  if (repairedIds.length !== dayCount) {
    throw createClassifiedError_('Coverage repair changed the required teaching-day count.', 'validation');
  }

  var changedDayNumbers = [];
  var groups = repairedIds.map(function (bowId, index) {
    if (bowId !== originalIds[index]) {
      changedDayNumbers.push(index + 1);
    }
    return {
      dayNumber: index + 1,
      bowIds: [bowId],
      weekNumber: String(bowMap[bowId].record.WeekNumber || '').trim()
    };
  });

  return {
    groups: groups,
    changedDayNumbers: changedDayNumbers,
    missingBowIds: missingIndexes.map(function (index) {
      return String(records[index].BOW_ID || '').trim();
    })
  };
}

function mergeLockedCoverageMetadata_(existingDays, metadataPlan, coverageGroups, targetDayNumbers) {
  if (!metadataPlan || !Array.isArray(metadataPlan.days)) {
    throw createClassifiedError_('Locked term-plan metadata response must contain a days array.', 'validation');
  }

  var targetMap = {};
  (targetDayNumbers || []).forEach(function (dayNumber) {
    targetMap[Number(dayNumber)] = true;
  });
  var metadataByDay = {};
  metadataPlan.days.forEach(function (day) {
    var dayNumber = Number(day.dayNumber);
    if (!targetMap[dayNumber]) {
      throw createClassifiedError_('Metadata response returned unexpected Day ' + day.dayNumber + '.', 'validation');
    }
    if (metadataByDay[dayNumber]) {
      throw createClassifiedError_('Metadata response returned duplicate Day ' + dayNumber + '.', 'validation');
    }
    metadataByDay[dayNumber] = day;
  });

  var targets = Object.keys(targetMap);
  if (targets.length !== metadataPlan.days.length) {
    throw createClassifiedError_('Metadata response did not return every requested changed day.', 'validation');
  }

  var existingByDay = {};
  (existingDays || []).forEach(function (day) {
    existingByDay[Number(day.dayNumber || day.DayNumber)] = day;
  });

  return {
    days: (coverageGroups || []).map(function (group) {
      var dayNumber = Number(group.dayNumber);
      var source = metadataByDay[dayNumber] || existingByDay[dayNumber];
      if (!source) {
        throw createClassifiedError_('No metadata is available for locked Day ' + dayNumber + '.', 'validation');
      }
      return {
        dayNumber: dayNumber,
        bowId: group.bowIds[0],
        coveredBowIds: group.bowIds.slice(),
        dayType: source.dayType || source.DayType,
        lessonTitle: source.lessonTitle || source.LessonTitle,
        difficultyWeight: typeof source.difficultyWeight !== 'undefined'
          ? source.difficultyWeight
          : source.DifficultyWeight,
        shortPurpose: source.shortPurpose || source.ShortPurpose
      };
    })
  };
}
