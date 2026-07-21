function buildTermPlanningPrompt_(job, bowRecords) {
  var totalDays = Number(job.TotalTeachingDays || getTermDayCount_(job.Term));
  var calendar = resolveTermCalendar_(job.GradeLevel, job.Subject, job.Term, bowRecords);
  var subjectProfile = getSubjectProfileForPrompt_(job);
  var profileGuidance = buildSubjectProfileGuidanceLines_(subjectProfile, 'PlanningRules');
  var orderedBowSequence = bowRecords.map(function (record, index) {
    return (index + 1) + ': ' + cleanPromptValue_(record.BOW_ID);
  }).join('\n');
  var retryGuidance = [];
  var previousValidationError = String(job.LastPlanValidationError || '').trim();
  if (previousValidationError) {
    retryGuidance = [
      'Previous planning attempt failed validation:',
      cleanPromptValue_(previousValidationError),
      '',
      'Generate a new plan that explicitly corrects this failure.',
      ''
    ];
  }
  var bowContext = bowRecords.map(function (record, index) {
    return [
      'BOW item ' + (index + 1),
      'BOW_ID: ' + cleanPromptValue_(record.BOW_ID),
      'WeekNumber: ' + cleanPromptValue_(record.WeekNumber),
      'Domain: ' + cleanPromptValue_(record.Domain),
      'LearningCompetency: ' + cleanPromptValue_(record.LearningCompetency)
    ].join('\n');
  }).join('\n\n');

  var systemPrompt = [
    'You are an expert Philippine curriculum planner.',
    'Create a strict JSON term-day plan anchored only to the provided Budget of Work records.',
    'Do not invent BOW_ID values.',
    'Return only dayNumber, bowId, dayType, lessonTitle, difficultyWeight, and shortPurpose for each day.',
    'Do not return official BOW Week, Domain, ContentStandard, PerformanceStandard, or LearningCompetency text; the system will resolve those from BOW_DATABASE.',
    'Preserve the official BOW order.',
    'Include every BOW_ID at least once.',
    'Use harder competencies for more teaching days and simpler competencies for fewer days.',
    'Include instruction, practice, remediation, enrichment, weekly assessments, applications, and performance tasks.',
    'Label days by Day 1, Day 2, and so on, not calendar dates.',
    'Return only valid JSON that follows the schema.'
  ].join('\n');

  var userPrompt = [
    'Create a full-term plan for exactly ' + totalDays + ' teaching days.',
    '',
    'Teacher and class context:',
    'TeacherName: ' + cleanPromptValue_(job.TeacherName),
    'SchoolName: ' + cleanPromptValue_(job.SchoolName),
    'SchoolYear: ' + cleanPromptValue_(job.SchoolYear),
    'GradeLevel: ' + cleanPromptValue_(job.GradeLevel),
    'ClassSection: ' + cleanPromptValue_(job.ClassSection),
    'Subject: ' + cleanPromptValue_(job.Subject),
    'Term: ' + cleanPromptValue_(job.Term),
    'ClassLearningAbility: ' + cleanPromptValue_(job.ClassLearningAbility),
    'PreferredLanguage: ' + cleanPromptValue_(job.PreferredLanguage),
    getLanguageInstruction_(job.PreferredLanguage),
    'AvailableMaterials: ' + cleanPromptValue_(job.AvailableMaterials),
    'PreferredTeachingStrategy: ' + cleanPromptValue_(job.PreferredTeachingStrategy),
    'SpecialInstructions: ' + cleanPromptValue_(job.SpecialInstructions),
    '',
    profileGuidance.join('\n'),
    '',
    'Planning rules:',
    '- Exactly ' + totalDays + ' day objects.',
    '- Day numbers must be sequential from 1 to ' + totalDays + '.',
    calendar.mode === 'legacy_global'
      ? '- Follow five teaching days per week.'
      : '- Follow the backend-locked official pacing allocation; do not infer or change teaching days per week.',
    '- Preserve the BOW order. Do not move a later BOW before an earlier BOW.',
    '- The bowId sequence across Day 1 through Day ' + totalDays + ' must be nondecreasing according to the ordered BOW list.',
    '- Each BOW_ID must occupy one contiguous block of days.',
    '- Once the plan advances to a later BOW_ID, it must never return to an earlier BOW_ID.',
    '- Review, remediation, assessment, and performance-task days must remain assigned to the current BOW_ID. They may review earlier skills in shortPurpose without changing bowId to an earlier item.',
    '- Before returning JSON, verify every adjacent pair of days follows this rule.',
    '- Every BOW_ID below must appear at least once.',
    '- Include daily formative assessment in the short purpose.',
    '- Use longer assessment or performance-task days where appropriate.',
    '- Keep lesson titles concise and non-duplicative.',
    '',
    'Ordered BOW sequence:',
    orderedBowSequence,
    '',
    retryGuidance.join('\n'),
    'Allowed dayType values: Instruction, Guided Practice, Independent Practice, Assessment, Weekly Assessment, Remediation, Enrichment, Application, Performance Task, Review.',
    '',
    'Budget of Work records:',
    bowContext
  ].join('\n');

  return {
    systemPrompt: systemPrompt,
    userPrompt: userPrompt,
    schema: getTermPlanJsonSchema_(),
    schemaName: 'term_day_plan'
  };
}

function buildDenseTermPlanningPrompt_(job, bowRecords, coverageGroups) {
  var subjectProfile = getSubjectProfileForPrompt_(job);
  var profileGuidance = buildSubjectProfileGuidanceLines_(subjectProfile, 'PlanningRules');
  var lockedContext = buildLockedCoveragePromptContext_(coverageGroups, bowRecords);
  var totalDays = coverageGroups.length;

  return {
    systemPrompt: [
      'You are an expert Philippine curriculum planner.',
      'The backend has already locked complete ordered BOW coverage for every teaching day.',
      'Generate metadata only for each locked day.',
      'Never select, return, remove, reorder, rename, or alter BOW_ID values.',
      'Return only dayNumber, dayType, lessonTitle, difficultyWeight, and shortPurpose.',
      'Return only valid JSON that follows the schema.'
    ].join('\n'),
    userPrompt: [
      'Create metadata for exactly ' + totalDays + ' locked teaching days.',
      '',
      'Teacher and class context:',
      'TeacherName: ' + cleanPromptValue_(job.TeacherName),
      'SchoolName: ' + cleanPromptValue_(job.SchoolName),
      'SchoolYear: ' + cleanPromptValue_(job.SchoolYear),
      'GradeLevel: ' + cleanPromptValue_(job.GradeLevel),
      'ClassSection: ' + cleanPromptValue_(job.ClassSection),
      'Subject: ' + cleanPromptValue_(job.Subject),
      'Term: ' + cleanPromptValue_(job.Term),
      'ClassLearningAbility: ' + cleanPromptValue_(job.ClassLearningAbility),
      'PreferredLanguage: ' + cleanPromptValue_(job.PreferredLanguage),
      getLanguageInstruction_(job.PreferredLanguage),
      'AvailableMaterials: ' + cleanPromptValue_(job.AvailableMaterials),
      'PreferredTeachingStrategy: ' + cleanPromptValue_(job.PreferredTeachingStrategy),
      'SpecialInstructions: ' + cleanPromptValue_(job.SpecialInstructions),
      '',
      profileGuidance.join('\n'),
      '',
      'Metadata rules:',
      '- Return exactly one metadata object for every Day 1 through Day ' + totalDays + '.',
      '- Keep day numbers sequential.',
      '- Align each title and shortPurpose with all locked BOW records listed for that day.',
      '- Include daily formative assessment in shortPurpose.',
      '- Include instruction, practice, remediation, enrichment, assessment, application, and performance tasks where appropriate.',
      '- Keep lesson titles concise and non-duplicative.',
      '- Do not return any BOW_ID or official curriculum field.',
      '- Allowed dayType values: Instruction, Guided Practice, Independent Practice, Assessment, Weekly Assessment, Remediation, Enrichment, Application, Performance Task, Review.',
      '',
      'Locked day coverage:',
      lockedContext
    ].join('\n'),
    schema: getTermPlanMetadataJsonSchema_(),
    schemaName: 'locked_term_day_metadata'
  };
}

function buildTermPlanMetadataRepairPrompt_(job, existingDays, coverageGroups, changedDayNumbers, bowRecords, missingBowIds) {
  var subjectProfile = getSubjectProfileForPrompt_(job);
  var profileGuidance = buildSubjectProfileGuidanceLines_(subjectProfile, 'PlanningRules');
  var changedMap = {};
  (changedDayNumbers || []).forEach(function (dayNumber) {
    changedMap[Number(dayNumber)] = true;
  });
  var changedGroups = (coverageGroups || []).filter(function (group) {
    return changedMap[Number(group.dayNumber)];
  });
  var currentPlan = (existingDays || []).map(function (day) {
    return [
      'Day ' + cleanPromptValue_(day.dayNumber || day.DayNumber),
      'BOW_ID: ' + cleanPromptValue_(day.bowId || day.BOW_ID),
      'DayType: ' + cleanPromptValue_(day.dayType || day.DayType),
      'LessonTitle: ' + cleanPromptValue_(day.lessonTitle || day.LessonTitle),
      'ShortPurpose: ' + cleanPromptValue_(day.shortPurpose || day.ShortPurpose)
    ].join(' | ');
  }).join('\n');

  return {
    systemPrompt: [
      'You are repairing metadata for a Philippine term-day plan whose BOW assignments were corrected deterministically by the backend.',
      'The locked BOW assignments cannot be changed.',
      'Return metadata only for the requested changed days.',
      'Never return or alter BOW_ID values or official curriculum fields.',
      'Return only valid JSON that follows the schema.'
    ].join('\n'),
    userPrompt: [
      'Repair only these day numbers: ' + changedDayNumbers.join(', ') + '.',
      'The previous candidate omitted these required BOW_IDs: ' + (missingBowIds || []).join(', ') + '.',
      '',
      'Context:',
      'GradeLevel: ' + cleanPromptValue_(job.GradeLevel),
      'Subject: ' + cleanPromptValue_(job.Subject),
      'Term: ' + cleanPromptValue_(job.Term),
      'ClassLearningAbility: ' + cleanPromptValue_(job.ClassLearningAbility),
      'PreferredLanguage: ' + cleanPromptValue_(job.PreferredLanguage),
      getLanguageInstruction_(job.PreferredLanguage),
      'AvailableMaterials: ' + cleanPromptValue_(job.AvailableMaterials),
      'PreferredTeachingStrategy: ' + cleanPromptValue_(job.PreferredTeachingStrategy),
      'SpecialInstructions: ' + cleanPromptValue_(job.SpecialInstructions),
      '',
      profileGuidance.join('\n'),
      '',
      'Existing candidate assignments and metadata:',
      currentPlan,
      '',
      'Backend-locked replacement coverage for changed days:',
      buildLockedCoveragePromptContext_(changedGroups, bowRecords),
      '',
      'Return exactly ' + changedDayNumbers.length + ' metadata objects, one for each requested day.',
      'Preserve the surrounding progression and make each changed title and shortPurpose align with all locked BOW records for that day.',
      'Do not return metadata for unchanged days.',
      'Do not return any BOW_ID or official curriculum field.'
    ].join('\n'),
    schema: getTermPlanMetadataJsonSchema_(),
    schemaName: 'term_day_metadata_repair'
  };
}

function buildLockedCoveragePromptContext_(coverageGroups, bowRecords) {
  var bowMap = buildBowMapForTerm_(bowRecords);
  return (coverageGroups || []).map(function (group) {
    var records = group.bowIds.map(function (bowId) {
      var entry = bowMap[bowId];
      if (!entry) {
        throw createClassifiedError_('Locked coverage references unsupported BOW_ID: ' + bowId + '.', 'validation');
      }
      return entry.record;
    });
    return [
      'Day ' + group.dayNumber,
      records.map(function (record) {
        return [
          'BOW_ID: ' + cleanPromptValue_(record.BOW_ID),
          'WeekNumber: ' + cleanPromptValue_(record.WeekNumber),
          'Domain: ' + cleanPromptValue_(record.Domain),
          'LearningCompetency: ' + cleanPromptValue_(record.LearningCompetency)
        ].join('\n');
      }).join('\n---\n')
    ].join('\n');
  }).join('\n\n');
}

function buildDailyLessonPrompt_(job, dayPlan, bowRecords, previousSummary, nextDayPlan) {
  bowRecords = Array.isArray(bowRecords) ? bowRecords : [bowRecords];
  var subjectProfile = getSubjectProfileForPrompt_(job);
  var profileGuidance = buildSubjectProfileGuidanceLines_(subjectProfile, 'DailyLessonRules');
  var teacherContext = ['Philippine', job.GradeLevel, job.Subject, 'teacher'].filter(Boolean).join(' ');
  var coveredBowIds = bowRecords.map(function (record) { return record.BOW_ID; });
  var bowSourceContext = bowRecords.map(function (record, index) {
    return [
      'Covered BOW record ' + (index + 1),
      'BOW_ID: ' + cleanPromptValue_(record.BOW_ID),
      'WeekNumber: ' + cleanPromptValue_(record.WeekNumber),
      'Domain: ' + cleanPromptValue_(record.Domain),
      'ContentStandard: ' + cleanPromptValue_(record.ContentStandard),
      'PerformanceStandard: ' + cleanPromptValue_(record.PerformanceStandard),
      'LearningCompetency: ' + cleanPromptValue_(record.LearningCompetency)
    ].join('\n');
  }).join('\n\n');
  var systemPrompt = [
    'You are generating one AI-assisted daily ILAW lesson plan draft for a ' + teacherContext + '.',
    'Use the locked term-day plan row and every exact covered BOW competency as the source of truth.',
    'Return only valid JSON that follows the schema.',
    'Do not include the unwanted footer text "THIS ACTIVITY SHEET IS NOT FOR SALE" or tinyurl links.',
    'Make the lesson editable, classroom-ready, age-appropriate, and aligned to the selected language.'
  ].join('\n');

  var userPrompt = [
    'Generate one detailed daily lesson for this locked term plan row.',
    '',
    'Teacher and class information:',
    'TeacherName: ' + cleanPromptValue_(job.TeacherName),
    'TeacherEmail: ' + cleanPromptValue_(job.TeacherEmail),
    'SchoolName: ' + cleanPromptValue_(job.SchoolName),
    'SchoolYear: ' + cleanPromptValue_(job.SchoolYear),
    'GradeLevel: ' + cleanPromptValue_(job.GradeLevel),
    'ClassSection: ' + cleanPromptValue_(job.ClassSection),
    'Subject: ' + cleanPromptValue_(job.Subject),
    'Term: ' + cleanPromptValue_(job.Term),
    'TotalTeachingDays: ' + cleanPromptValue_(job.TotalTeachingDays),
    'ClassLearningAbility: ' + cleanPromptValue_(job.ClassLearningAbility),
    'LearnerContext: ' + cleanPromptValue_(job.LearnerContext),
    'AvailableMaterials: ' + cleanPromptValue_(job.AvailableMaterials),
    'PreferredTeachingStrategy: ' + cleanPromptValue_(job.PreferredTeachingStrategy),
    'SpecialInstructions: ' + cleanPromptValue_(job.SpecialInstructions),
    'PreferredLanguage: ' + cleanPromptValue_(job.PreferredLanguage),
    getLanguageInstruction_(job.PreferredLanguage),
    '',
    'Locked day plan:',
    'DayNumber: ' + cleanPromptValue_(dayPlan.DayNumber),
    'BOWWeek: ' + cleanPromptValue_(dayPlan.BOWWeek),
    'BOW_ID: ' + cleanPromptValue_(dayPlan.BOW_ID),
    'CoveredBOW_IDs: ' + cleanPromptValue_(serializeCoveredBowIds_(coveredBowIds)),
    'Domain: ' + cleanPromptValue_(dayPlan.Domain),
    'LearningCompetency: ' + cleanPromptValue_(dayPlan.LearningCompetency),
    'DayType: ' + cleanPromptValue_(dayPlan.DayType),
    'LessonTitle: ' + cleanPromptValue_(dayPlan.LessonTitle),
    'DifficultyWeight: ' + cleanPromptValue_(dayPlan.DifficultyWeight),
    'ShortPurpose: ' + cleanPromptValue_(dayPlan.ShortPurpose),
    '',
    'Exact covered BOW curriculum sources:',
    bowSourceContext,
    'Use and align to every covered record above. Do not omit, merge, rename, or invent a BOW_ID.',
    '',
    'Continuity:',
    'PreviousDaySummary: ' + cleanPromptValue_(previousSummary),
    'NextPlannedDay: ' + (nextDayPlan ? cleanPromptValue_('Day ' + nextDayPlan.DayNumber + ': ' + nextDayPlan.LessonTitle + ' (' + nextDayPlan.DayType + ')') : '(none)'),
    '',
    profileGuidance.join('\n'),
    '',
    'Required ILAW structure:',
    '- Day Number',
    '- Lesson Title',
    '- The document will include BOW Week, BOW ID, Domain, and Learning Competency from trusted BOW_DATABASE records.',
    '- Learning Objectives',
    '- Pre-Lesson',
    '- Learning Flow with teacher activity, learner activity, estimated time, and notes',
    '- Learning Resources',
    '- Opportunities for Integration',
    '- Formative Assessment and Answer Key',
    '- Compact Remediation',
    '- Compact Enrichment',
    '- Suggested editable reflection, not a claim of verified classroom events',
    '- A clearly blank Teacher Additional Reflection area',
    '',
    'Do not return bowWeek, bowId, domain, or learningCompetency fields in the JSON. The backend inserts those trusted fields into the document.',
    '',
    'Output Quality v1.1 Guidance:',
    '- Make teacherActivity specific enough for a teacher to use: include concise teacher talk, board work, checking questions, likely misconceptions, or facilitation moves when useful.',
    '- Make learnerActivity student-facing: include clear learner directions, sample expected responses, and what learners should say, write, draw, solve, sort, explain, or discuss.',
    '- Use word problems only when they naturally fit the competency, especially for operations, measurement, data, real-life application, or problem solving. Keep them age-appropriate and easy to revise.',
    '- Use simple black-and-white text-only diagrams only when they help understanding. Acceptable formats: ASCII diagrams, number lines, tables, arrows, box models, labeled shapes, or teacher-drawable board diagrams using keyboard characters only.',
    '- Do not create or request image files, image-generation tools, external assets, colored images, SVG, or markdown image links.',
    '- Keep any text-only diagram short, preferably 3 to 8 lines. If it would be too wide for a table cell, describe it as a simple board drawing the teacher can copy instead.',
    '- Do not force a word problem or diagram into every lesson. Include at most one concise diagram and one or two word problems when they genuinely improve the lesson.',
    '',
    'Assign reasonable estimated times to learning-flow activities based on grade level, activity complexity, and lesson type.',
    'Do not use one fixed duration for every lesson. Keep estimated times internally reasonable and consistent within this lesson.',
    'Include this exact note in the timeAdjustmentNote field: Estimated times may be adjusted based on the school\'s actual class schedule.',
    'Weekly Assessment days may include around 10 items when pedagogically appropriate.'
  ].join('\n');

  return {
    systemPrompt: systemPrompt,
    userPrompt: userPrompt,
    schema: getDailyLessonJsonSchema_(),
    schemaName: 'daily_ilaw_lesson'
  };
}

function buildFinalAssessmentPrompt_(job, bowRecords) {
  var subjectProfile = getSubjectProfileForPrompt_(job);
  var profileGuidance = buildSubjectProfileGuidanceLines_(subjectProfile, 'AssessmentRules');
  var bowContext = (bowRecords || []).map(function (record, index) {
    return [
      'BOW item ' + (index + 1),
      'BOW_ID: ' + cleanPromptValue_(record.BOW_ID),
      'WeekNumber: ' + cleanPromptValue_(record.WeekNumber),
      'Domain: ' + cleanPromptValue_(record.Domain),
      'ContentStandard: ' + cleanPromptValue_(record.ContentStandard),
      'PerformanceStandard: ' + cleanPromptValue_(record.PerformanceStandard),
      'LearningCompetency: ' + cleanPromptValue_(record.LearningCompetency)
    ].join('\n');
  }).join('\n\n');

  var systemPrompt = [
    'You are creating a compact editable final term assessment draft for a Philippine teacher.',
    'Use only the selected term BOW records and teacher/class context.',
    'Return only valid JSON that follows the schema.',
    'Do not claim learners already completed the assessment.',
    'Do not include the unwanted footer text "THIS ACTIVITY SHEET IS NOT FOR SALE" or tinyurl links.'
  ].join('\n');

  var userPrompt = [
    'Create one final assessment draft for the completed full-term lesson-plan document.',
    '',
    'Teacher and class information:',
    'TeacherName: ' + cleanPromptValue_(job.TeacherName),
    'TeacherEmail: ' + cleanPromptValue_(job.TeacherEmail),
    'SchoolName: ' + cleanPromptValue_(job.SchoolName),
    'SchoolYear: ' + cleanPromptValue_(job.SchoolYear),
    'GradeLevel: ' + cleanPromptValue_(job.GradeLevel),
    'ClassSection: ' + cleanPromptValue_(job.ClassSection),
    'Subject: ' + cleanPromptValue_(job.Subject),
    'Term: ' + cleanPromptValue_(job.Term),
    'ClassLearningAbility: ' + cleanPromptValue_(job.ClassLearningAbility),
    'LearnerContext: ' + cleanPromptValue_(job.LearnerContext),
    'AvailableMaterials: ' + cleanPromptValue_(job.AvailableMaterials),
    'PreferredTeachingStrategy: ' + cleanPromptValue_(job.PreferredTeachingStrategy),
    'SpecialInstructions: ' + cleanPromptValue_(job.SpecialInstructions),
    'PreferredLanguage: ' + cleanPromptValue_(job.PreferredLanguage),
    getLanguageInstruction_(job.PreferredLanguage),
    '',
    profileGuidance.join('\n'),
    '',
    'Assessment requirements:',
    '- Align all items with the BOW records below.',
    '- Include clear directions, varied written items, an answer key, and one compact performance or application task.',
    '- Keep it editable and appropriate for the grade level and class learning ability.',
    '- Use word problems only when they naturally fit the assessed competency, such as operations, measurement, data, real-life application, or problem solving.',
    '- Use simple text-only diagrams, tables, number lines, or teacher-drawable board sketches only when helpful for an item or performance task.',
    '- Do not create or request image files, image-generation tools, external assets, colored images, SVG, or markdown image links.',
    '- Do not say or imply that learners already completed the assessment.',
    '- The teacher will review, revise, and validate before classroom use.',
    '',
    'Selected term BOW records:',
    bowContext
  ].join('\n');

  return {
    systemPrompt: systemPrompt,
    userPrompt: userPrompt,
    schema: getFinalAssessmentJsonSchema_(),
    schemaName: 'final_term_assessment'
  };
}

function getSubjectProfileForPrompt_(job) {
  var support = getSupportStatus_(job);
  if (!support || !support.supported || !support.promptProfile) {
    throw createClassifiedError_(
      'Unable to resolve active subject profile before OpenAI call for Grade=' + cleanPromptValue_(job.GradeLevel) +
      ', Subject=' + cleanPromptValue_(job.Subject) +
      ', Term=' + cleanPromptValue_(job.Term) +
      '. Reason: ' + (support && support.reason ? support.reason : 'No active PromptProfile was found.'),
      'validation'
    );
  }
  return support.promptProfile;
}

function buildSubjectProfileGuidanceLines_(subjectProfile, ruleFieldName) {
  return [
    'Subject Profile Guidance:',
    'PromptProfile: ' + cleanPromptValue_(subjectProfile.PromptProfile),
    'ProfileName: ' + cleanPromptValue_(subjectProfile.ProfileName),
    ruleFieldName + ': ' + cleanPromptValue_(subjectProfile[ruleFieldName])
  ];
}

function buildLessonPlanPrompt(formRow, bowRecord) {
  return {
    systemPrompt: 'Return only valid JSON for one ILAW lesson plan.',
    userPrompt: [
      'Generate one legacy weekly lesson plan.',
      'TeacherName: ' + cleanPromptValue_(formRow.TeacherName),
      'GradeLevel: ' + cleanPromptValue_(formRow.GradeLevel),
      'Subject: ' + cleanPromptValue_(formRow.Subject),
      'Term: ' + cleanPromptValue_(formRow.Term),
      'WeekNumber: ' + cleanPromptValue_(formRow.WeekNumber),
      'BOW_ID: ' + cleanPromptValue_(bowRecord.BOW_ID),
      'LearningCompetency: ' + cleanPromptValue_(bowRecord.LearningCompetency)
    ].join('\n'),
    schema: getLessonPlanJsonSchema_(),
    schemaName: 'ilaw_lesson_plan'
  };
}

function getFinalAssessmentJsonSchema_() {
  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      assessmentTitle: { type: 'string' },
      directions: { type: 'string' },
      coverageSummary: { type: 'string' },
      writtenAssessment: {
        type: 'object',
        additionalProperties: false,
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                number: { type: 'integer' },
                itemType: { type: 'string' },
                prompt: { type: 'string' },
                choices: { type: 'array', items: { type: 'string' } },
                answer: { type: 'string' },
                points: { type: 'integer' }
              },
              required: ['number', 'itemType', 'prompt', 'choices', 'answer', 'points']
            }
          },
          answerKey: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                number: { type: 'integer' },
                answer: { type: 'string' },
                explanation: { type: 'string' }
              },
              required: ['number', 'answer', 'explanation']
            }
          }
        },
        required: ['items', 'answerKey']
      },
      performanceTask: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: { type: 'string' },
          directions: { type: 'string' },
          output: { type: 'string' },
          criteria: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                criterion: { type: 'string' },
                description: { type: 'string' },
                points: { type: 'integer' }
              },
              required: ['criterion', 'description', 'points']
            }
          }
        },
        required: ['title', 'directions', 'output', 'criteria']
      },
      teacherNotes: { type: 'string' },
      languageUsed: { type: 'string' }
    },
    required: [
      'assessmentTitle',
      'directions',
      'coverageSummary',
      'writtenAssessment',
      'performanceTask',
      'teacherNotes',
      'languageUsed'
    ]
  };
}

function getLanguageInstruction_(preferredLanguage) {
  var language = normalizePreferredLanguage_(preferredLanguage);
  if (language === 'Filipino') {
    return 'LanguageInstruction: Write the lesson plan in Filipino using clear, age-appropriate classroom language. Keep official curriculum terms understandable for the teacher.';
  }
  if (language === 'Bilingual') {
    return 'LanguageInstruction: Write an intentional English-Filipino lesson plan. Use English for concise headings and curriculum labels when helpful, and Filipino for teacher talk, learner directions, examples, and classroom interaction. Do not silently convert this to English-only.';
  }
  return 'LanguageInstruction: Write the lesson plan in English using clear, age-appropriate classroom language.';
}

function getTermPlanJsonSchema_() {
  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      days: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            dayNumber: { type: 'integer' },
            bowId: { type: 'string' },
            dayType: { type: 'string' },
            lessonTitle: { type: 'string' },
            difficultyWeight: { type: 'number' },
            shortPurpose: { type: 'string' }
          },
          required: [
            'dayNumber',
            'bowId',
            'dayType',
            'lessonTitle',
            'difficultyWeight',
            'shortPurpose'
          ]
        }
      }
    },
    required: ['days']
  };
}

function getTermPlanMetadataJsonSchema_() {
  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      days: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            dayNumber: { type: 'integer' },
            dayType: { type: 'string' },
            lessonTitle: { type: 'string' },
            difficultyWeight: { type: 'number' },
            shortPurpose: { type: 'string' }
          },
          required: [
            'dayNumber',
            'dayType',
            'lessonTitle',
            'difficultyWeight',
            'shortPurpose'
          ]
        }
      }
    },
    required: ['days']
  };
}

function getDailyLessonJsonSchema_() {
  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      dayNumber: { type: 'integer' },
      lessonTitle: { type: 'string' },
      learningObjectives: { type: 'array', items: { type: 'string' } },
      preLesson: { type: 'string' },
      learningFlow: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            phase: { type: 'string' },
            teacherActivity: { type: 'string' },
            learnerActivity: { type: 'string' },
            estimatedTime: { type: 'string' },
            notesOrAccommodations: { type: 'string' }
          },
          required: ['phase', 'teacherActivity', 'learnerActivity', 'estimatedTime', 'notesOrAccommodations']
        }
      },
      timeAdjustmentNote: { type: 'string' },
      learningResources: { type: 'array', items: { type: 'string' } },
      opportunitiesForIntegration: { type: 'string' },
      formativeAssessment: {
        type: 'object',
        additionalProperties: false,
        properties: {
          instructions: { type: 'string' },
          items: { type: 'array', items: { type: 'string' } },
          answerKey: { type: 'array', items: { type: 'string' } }
        },
        required: ['instructions', 'items', 'answerKey']
      },
      compactRemediation: { type: 'string' },
      compactEnrichment: { type: 'string' },
      suggestedReflection: { type: 'string' },
      teacherAdditionalReflectionBlank: { type: 'string' },
      daySummary: { type: 'string' }
    },
    required: [
      'dayNumber',
      'lessonTitle',
      'learningObjectives',
      'preLesson',
      'learningFlow',
      'timeAdjustmentNote',
      'learningResources',
      'opportunitiesForIntegration',
      'formativeAssessment',
      'compactRemediation',
      'compactEnrichment',
      'suggestedReflection',
      'teacherAdditionalReflectionBlank',
      'daySummary'
    ]
  };
}

function getLessonPlanJsonSchema_() {
  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      lessonTitle: { type: 'string' },
      learningArea: { type: 'string' },
      teacherName: { type: 'string' },
      gradeLevelAndSection: { type: 'string' },
      numberOfSessions: { type: 'string' },
      references: { type: 'string' },
      aiDeclaration: { type: 'string' },
      learningCompetencyAndStandards: { type: 'string' },
      learningObjectives: { type: 'array', items: { type: 'string' } },
      learnerContext: { type: 'string' },
      preLesson: { type: 'string' },
      flow: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            phase: { type: 'string' },
            teacherActivity: { type: 'string' },
            learnerActivity: { type: 'string' },
            estimatedTime: { type: 'string' },
            notes: { type: 'string' }
          },
          required: ['phase', 'teacherActivity', 'learnerActivity', 'estimatedTime', 'notes']
        }
      },
      learningResources: { type: 'array', items: { type: 'string' } },
      opportunitiesForIntegration: { type: 'string' },
      formativeAssessment: {
        type: 'object',
        additionalProperties: false,
        properties: {
          instructions: { type: 'string' },
          items: { type: 'array', items: { type: 'string' } },
          answerKey: { type: 'array', items: { type: 'string' } }
        },
        required: ['instructions', 'items', 'answerKey']
      },
      extendedLearningOpportunities: { type: 'string' },
      reflections: { type: 'string' }
    },
    required: [
      'lessonTitle',
      'learningArea',
      'teacherName',
      'gradeLevelAndSection',
      'numberOfSessions',
      'references',
      'aiDeclaration',
      'learningCompetencyAndStandards',
      'learningObjectives',
      'learnerContext',
      'preLesson',
      'flow',
      'learningResources',
      'opportunitiesForIntegration',
      'formativeAssessment',
      'extendedLearningOpportunities',
      'reflections'
    ]
  };
}
