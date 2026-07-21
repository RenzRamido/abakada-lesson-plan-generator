function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Lesson Plan Generator')
    .addItem('Setup or Upgrade Project', 'setupHeaders')
    .addSeparator()
    .addItem('Set OpenAI API Key', 'setOpenAIApiKey')
    .addItem('Set Generated Lesson Plans Folder ID', 'setGeneratedLessonPlansFolderId')
    .addItem('Test OpenAI Connection', 'testOpenAIConnection')
    .addSeparator()
    .addItem('Install or Repair Triggers', 'installOrRepairTriggers')
    .addItem('Run Queue Worker Now', 'runQueueWorkerNow')
    .addItem('Process Selected Row', 'processSelectedRow')
    .addSeparator()
    .addItem('Retry Selected Job', 'retrySelectedJob')
    .addItem('Resume Waiting Job', 'resumeWaitingJob')
    .addItem('View Active Job', 'viewActiveJob')
    .addSeparator()
    .addItem('Run Preflight Checks', 'runPreflightChecks')
    .addToUi();
}

function setupHeaders() {
  setupOrUpgradeProject();
  SpreadsheetApp.getUi().alert('Setup or upgrade complete. Existing rows, BOW records, and config values were preserved.');
}

function setupOrUpgradeProject() {
  ensureAuthorizedEmailsSheet_();
  appendMissingHeaders_(ensureResponseSheet_(), FORM_RESPONSE_HEADERS);
  appendMissingHeaders_(getSheetByName_(SHEET_NAMES.BOW_DATABASE), BOW_HEADERS);
  appendMissingHeaders_(getSheetByName_(SHEET_NAMES.BOW_PACING_METADATA), BOW_PACING_METADATA_HEADERS);
  ensureExactManagedAuditSheet_(
    SHEET_NAMES.BOW_PACING_METADATA_AUDIT,
    BOW_PACING_METADATA_AUDIT_HEADERS
  );
  ensureExactManagedAuditSheet_(
    SHEET_NAMES.CURRICULUM_IMPORT_MANIFEST,
    CURRICULUM_IMPORT_MANIFEST_HEADERS
  );
  appendMissingHeaders_(getSheetByName_(SHEET_NAMES.SUPPORT_MATRIX), SUPPORT_MATRIX_HEADERS);
  appendMissingHeaders_(getSheetByName_(SHEET_NAMES.SUBJECT_PROFILES), SUBJECT_PROFILES_HEADERS);
  appendMissingHeaders_(getSheetByName_(SHEET_NAMES.CONFIG), CONFIG_HEADERS);
  appendMissingHeaders_(getSheetByName_(SHEET_NAMES.PROCESSING_LOG), PROCESSING_LOG_HEADERS);
  appendMissingHeaders_(getSheetByName_(SHEET_NAMES.GENERATED_HISTORY), GENERATED_HISTORY_HEADERS);
  appendMissingHeaders_(getSheetByName_(SHEET_NAMES.GENERATION_QUEUE), QUEUE_HEADERS);
  appendMissingHeaders_(getSheetByName_(SHEET_NAMES.TERM_DAY_PLAN), TERM_DAY_PLAN_HEADERS);

  seedDefaultConfig_();
  seedSupportFramework_();
  seedBowDatabase();
}

function ensureExactManagedAuditSheet_(sheetName, expectedHeaders) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
    sheet.setFrozenRows(1);
    return sheet;
  }

  if (sheet.getLastRow() === 0 && sheet.getLastColumn() === 0) {
    sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
    sheet.setFrozenRows(1);
    return sheet;
  }

  var lastColumn = sheet.getLastColumn();
  var actualHeaders = sheet.getRange(1, 1, 1, Math.max(lastColumn, 1)).getValues()[0]
    .map(function (value) {
      return String(value || '').trim();
    });
  if (
    lastColumn !== expectedHeaders.length ||
    actualHeaders.join('\u001f') !== expectedHeaders.join('\u001f')
  ) {
    throw new Error(
      sheetName + ' is populated and must have exactly these headers in order: ' +
      expectedHeaders.join(', ') + '. Setup did not modify the sheet.'
    );
  }

  return sheet;
}

function seedDefaultConfig_() {
  var sheet = getSheetByName_(SHEET_NAMES.CONFIG);
  var existing = {};

  if (sheet.getLastRow() >= 2) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues().forEach(function (row) {
      existing[String(row[0]).trim()] = true;
    });
  }

  Object.keys(DEFAULT_CONFIG).forEach(function (key) {
    if (!existing[key]) {
      sheet.appendRow([key, DEFAULT_CONFIG[key]]);
    }
  });
}

function seedSupportFramework_() {
  seedSubjectProfiles_();
  seedSupportMatrix_();
}

function seedSubjectProfiles_() {
  var sheet = getSheetByName_(SHEET_NAMES.SUBJECT_PROFILES);
  appendMissingHeaders_(sheet, SUBJECT_PROFILES_HEADERS);

  var existing = {};
  getSheetObjects_(sheet).forEach(function (row) {
    var key = normalizeForMatch_(row.PromptProfile);
    if (key) {
      existing[key] = true;
    }
  });

  var seeds = [
    {
      PromptProfile: 'G2_MATH_DEFAULT',
      Subject: 'Mathematics',
      ProfileName: 'Grade 2 Mathematics Default',
      PlanningRules: 'Preserve approved Grade 2 Math planning behavior',
      DailyLessonRules: 'Preserve approved daily lesson behavior',
      AssessmentRules: 'Preserve approved assessment behavior',
      Active: 'Yes',
      Notes: 'Baseline approved profile'
    }
  ];

  seeds.forEach(function (seed) {
    var key = normalizeForMatch_(seed.PromptProfile);
    if (!existing[key]) {
      appendObjectRow_(sheet, SUBJECT_PROFILES_HEADERS, seed);
      existing[key] = true;
    }
  });
}

function seedSupportMatrix_() {
  var sheet = getSheetByName_(SHEET_NAMES.SUPPORT_MATRIX);
  appendMissingHeaders_(sheet, SUPPORT_MATRIX_HEADERS);

  var existing = {};
  getSheetObjects_(sheet).forEach(function (row) {
    var key = supportMatrixKey_(row.GradeLevel, row.Subject, row.Term);
    if (key) {
      existing[key] = true;
    }
  });

  var seeds = [
    createSupportMatrixSeedRow_('Grade 2', 'Mathematics', 'First Term'),
    createSupportMatrixSeedRow_('Grade 2', 'Mathematics', 'Second Term'),
    createSupportMatrixSeedRow_('Grade 2', 'Mathematics', 'Third Term')
  ];

  seeds.forEach(function (seed) {
    var key = supportMatrixKey_(seed.GradeLevel, seed.Subject, seed.Term);
    if (!existing[key]) {
      appendObjectRow_(sheet, SUPPORT_MATRIX_HEADERS, seed);
      existing[key] = true;
    }
  });
}

function createSupportMatrixSeedRow_(gradeLevel, subject, term) {
  return {
    GradeLevel: gradeLevel,
    Subject: subject,
    Term: term,
    Status: 'Active',
    BOWComplete: 'Yes',
    PromptProfile: 'G2_MATH_DEFAULT',
    TeacherReviewed: 'Yes',
    Active: 'Yes',
    Notes: 'Seeded approved Grade 2 Mathematics support row'
  };
}

function setOpenAIApiKey() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt(
    'Set OpenAI API Key',
    'Paste the API key. It will be saved in Apps Script PropertiesService, not in the spreadsheet.',
    ui.ButtonSet.OK_CANCEL
  );

  if (result.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  var key = result.getResponseText().trim();
  if (!key) {
    ui.alert('No API key was entered.');
    return;
  }

  PropertiesService.getScriptProperties().setProperty('OPENAI_API_KEY', key);
  ui.alert('OpenAI API key saved in script properties.');
}

function setGeneratedLessonPlansFolderId() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt(
    'Set Generated Lesson Plans Folder ID',
    'Paste the Google Drive folder ID or folder URL for ABAKADA/02_GENERATED_LESSON_PLANS. The folder ID will be saved in Apps Script PropertiesService.',
    ui.ButtonSet.OK_CANCEL
  );

  if (result.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  var folderId = extractDriveFolderId_(result.getResponseText());
  if (!folderId) {
    ui.alert('No valid Google Drive folder ID was found.');
    return;
  }

  var folder;
  var folderName;
  try {
    folder = DriveApp.getFolderById(folderId);
    folderName = folder.getName();
    if (folder.isTrashed()) {
      ui.alert('The selected folder "' + folderName + '" is in the trash. Restore it or choose another folder.');
      return;
    }
  } catch (err) {
    ui.alert(
      'The folder could not be accessed. Check the folder ID and the script owner\'s Drive permissions.\n\n' +
      (err && err.message ? err.message : String(err))
    );
    return;
  }

  var confirmation = ui.alert(
    'Confirm Generated Lesson Plans Folder',
    'Folder name: ' + folderName + '\nFolder ID: ' + folderId + '\n\nUse this folder for all future generated lesson-plan files and exports?',
    ui.ButtonSet.YES_NO
  );
  if (confirmation !== ui.Button.YES) {
    return;
  }

  PropertiesService.getScriptProperties().setProperty(
    GENERATED_LESSON_PLANS_FOLDER_PROPERTY_,
    folderId
  );
  ui.alert('Generated lesson plans folder saved: ' + folderName + '.');
}

function extractDriveFolderId_(value) {
  var text = String(value || '').trim();
  if (!text) {
    return '';
  }

  var folderUrlMatch = text.match(/\/folders\/([A-Za-z0-9_-]+)/);
  if (folderUrlMatch) {
    return folderUrlMatch[1];
  }

  var idParameterMatch = text.match(/[?&]id=([A-Za-z0-9_-]+)/);
  if (idParameterMatch) {
    return idParameterMatch[1];
  }

  return /^[A-Za-z0-9_-]{10,}$/.test(text) ? text : '';
}

function runQueueWorkerNow() {
  processGenerationQueue();
  SpreadsheetApp.getUi().alert('Queue worker finished this execution window.');
}

function retrySelectedJob() {
  retryOrResumeSelectedJob_('Retry');
}

function resumeWaitingJob() {
  retryOrResumeSelectedJob_('Resume');
}

function retryOrResumeSelectedJob_(action) {
  var ui = SpreadsheetApp.getUi();
  var selected = getSelectedJobForMenu_();
  if (!selected) {
    ui.alert('Select a GENERATION_QUEUE row or a FORM_RESPONSES row with a JobID.');
    return;
  }

  if (String(selected.Status || '').trim() === STATUS.BLOCKED) {
    ui.alert('Blocked is a terminal authorization status. Require a fresh authorized submission instead of retrying this job.');
    return;
  }

  var authorization = evaluateQueueJobAuthorization_(selected);
  if (authorization.configurationUnavailable) {
    logAuthorizationConfigurationPause_(selected, action.toLowerCase());
    ui.alert(action + ' was refused because authorized-email configuration is unavailable or invalid. The job was not changed.');
    return;
  }
  if (!authorization.authorized) {
    blockQueueJobForAuthorization_(selected, authorization);
    ui.alert(action + ' was refused because the job failed the authorized-email gate. The job is now terminally Blocked.');
    return;
  }

  setupOrUpgradeProject();

  updateQueueJob_(selected, {
    Status: STATUS.WAITING_FOR_RETRY,
    CurrentPhase: action + ' requested by admin',
    RetryCount: 0,
    PlanningAttemptCount: 0,
    LastPlanningAttemptAt: '',
    NextRetryAt: '',
    LastPlanValidationError: '',
    FinalAssessmentStatus: '',
    FinalAssessmentAttemptCount: 0,
    FinalAssessmentLastError: '',
    LastError: ''
  });
  updateFormResponseProgress_(selected, {
    ProcessingStatus: STATUS.WAITING_FOR_RETRY,
    ErrorMessage: ''
  });
  logProcessing_(selected.SubmissionID, selected.JobID, STATUS.WAITING_FOR_RETRY, action + ' requested from custom menu.', '');
  ui.alert(action + ' requested for ' + selected.JobID + '. Run Queue Worker Now or wait for the trigger.');
}

function viewActiveJob() {
  setupOrUpgradeProject();
  var job = findNextEligibleQueueJob_();
  if (!job) {
    SpreadsheetApp.getUi().alert('No queued, planning, generating, or retry-waiting job found.');
    return;
  }

  SpreadsheetApp.getUi().alert([
    'Active or next eligible job:',
    'JobID: ' + job.JobID,
    'Teacher: ' + job.TeacherName,
    'Email: ' + job.TeacherEmail,
    'Status: ' + job.Status,
    'Phase: ' + job.CurrentPhase,
    'Current Day: ' + job.CurrentDay + ' / ' + job.TotalTeachingDays,
    'Doc: ' + (job.GeneratedDocLink || '(not created yet)'),
    'Last Error: ' + (job.LastError || '(none)')
  ].join('\n'));
}

function getSelectedJobForMenu_() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rowNumber = sheet.getActiveRange().getRow();
  if (rowNumber <= 1) {
    return null;
  }

  if (sheet.getName() === SHEET_NAMES.GENERATION_QUEUE) {
    var job = rowFromValues_(sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0], getHeaderMap_(sheet));
    job._rowNumber = rowNumber;
    return job.JobID ? job : null;
  }

  var row = getRowData_(sheet, rowNumber);
  if (!row.JobID) {
    return null;
  }

  var queueRowNumber = findQueueRowByJobId_(row.JobID);
  return queueRowNumber ? getQueueJobByRow_(queueRowNumber) : null;
}

function seedBowDatabase() {
  var sheet = getSheetByName_(SHEET_NAMES.BOW_DATABASE);
  appendMissingHeaders_(sheet, BOW_HEADERS);

  if (sheet.getLastRow() > 1) {
    return;
  }

  sheet.getRange(2, 1, BOW_SEED_DATA.length, BOW_HEADERS.length).setValues(BOW_SEED_DATA);
}

var FIRST_TERM_CONTENT_STANDARD = 'The learners should have knowledge and understanding of circles, half circles, quarter circles and composite figures made up of squares, rectangles, triangles, circles, half circles, and quarter circles; one step slides and flips of basic shapes and figures; whole numbers up to 1000; ordinal numbers up to 20th; addition of numbers with sums up to 1000; the denominations and values of Philippine coins and bills up to PHP 1000, and the addition of amounts of money with sums up to PHP 1000.';
var FIRST_TERM_PERFORMANCE_STANDARD = 'By the end of the term, the learners are able to represent and describe circles, half circles and quarter circles; compose and decompose composite figures; describe and draw the effect of one-step slides or flips; count, recognize, and represent whole numbers up to 1000; use ordinal numbers up to 20th; perform addition of numbers with sums up to 1000; determine and compare Philippine coins and bills up to PHP 1000; and add amounts of money with sums up to PHP 1000.';
var SECOND_TERM_CONTENT_STANDARD = 'The learners should have knowledge and understanding of measurement, comparison, and estimation of length and distance using appropriate tools and units; subtraction of numbers where both numbers are less than 1000; increasing patterns and decreasing patterns; and a pictograph with a scale for the representation of data.';
var SECOND_TERM_PERFORMANCE_STANDARD = 'By the end of the term, the learners are able to measure, compare, and estimate length and distance using appropriate units; perform subtraction of numbers where both numbers are less than 1000; extend and create increasing and decreasing patterns; and represent and interpret data in a pictograph with a scale.';
var THIRD_TERM_CONTENT_STANDARD = 'The learners should have knowledge and understanding of multiplication and division of whole numbers using the 2, 3, 4, 5, and 10 multiplication tables; odd and even numbers; unit fractions and similar fractions with denominators 2, 3, 4, 5, 6, and 8; duration of time, elapsed time, and telling and writing time in hours and minutes using a.m. and p.m.; straight and curved lines, and flat and curved surfaces; and the perimeter of triangles, squares, and rectangles.';
var THIRD_TERM_PERFORMANCE_STANDARD = 'By the end of the term, the learners are able to perform multiplication and division of whole numbers using the 2, 3, 4, 5, and 10 multiplication tables; distinguish even and odd numbers; represent, identify, and order unit fractions and similar fractions; work with time measured in hours, half-hours, quarter hours, days, weeks, months, and years; describe duration and elapsed time; tell and write time in hours and minutes; distinguish straight and curved lines and flat and curved surfaces; and find the perimeter of triangles, squares, and rectangles.';

var BOW_SEED_DATA = [
  ['BOW-G2-MATH-T1-W1', 'Grade 2', 'Mathematics', 'First Term', 'Week 1', 'Measurement and Geometry', FIRST_TERM_CONTENT_STANDARD, FIRST_TERM_PERFORMANCE_STANDARD, 'Represent and describe circles, half circles and quarter circles. Compose and decompose composite figures made up of squares, rectangles, triangles, circles, half circles, and quarter circles, using cut-outs and square grids.', ''],
  ['BOW-G2-MATH-T1-W2', 'Grade 2', 'Mathematics', 'First Term', 'Week 2', 'Measurement and Geometry', FIRST_TERM_CONTENT_STANDARD, FIRST_TERM_PERFORMANCE_STANDARD, 'Describe and draw the effect of a one-direction multi-step slide or translation in basic shapes and figures.', ''],
  ['BOW-G2-MATH-T1-W3', 'Grade 2', 'Mathematics', 'First Term', 'Week 3', 'Number and Algebra', FIRST_TERM_CONTENT_STANDARD, FIRST_TERM_PERFORMANCE_STANDARD, 'Count up to 1000.', ''],
  ['BOW-G2-MATH-T1-W4', 'Grade 2', 'Mathematics', 'First Term', 'Week 4', 'Number and Algebra', FIRST_TERM_CONTENT_STANDARD, FIRST_TERM_PERFORMANCE_STANDARD, 'Read and write numerals up to 1000.', ''],
  ['BOW-G2-MATH-T1-W5', 'Grade 2', 'Mathematics', 'First Term', 'Week 5', 'Number and Algebra', FIRST_TERM_CONTENT_STANDARD, FIRST_TERM_PERFORMANCE_STANDARD, 'Recognize and represent numbers up to 1000 using a variety of concrete and pictorial models, and numerals.', ''],
  ['BOW-G2-MATH-T1-W6', 'Grade 2', 'Mathematics', 'First Term', 'Week 6', 'Number and Algebra', FIRST_TERM_CONTENT_STANDARD, FIRST_TERM_PERFORMANCE_STANDARD, 'Count by 2s, 5s, 10s, 20s, 50s, and 100s, not beyond 1000. Order numbers up to 1000 from smallest to largest, and vice versa.', ''],
  ['BOW-G2-MATH-T1-W7', 'Grade 2', 'Mathematics', 'First Term', 'Week 7', 'Number and Algebra', FIRST_TERM_CONTENT_STANDARD, FIRST_TERM_PERFORMANCE_STANDARD, 'Describe the position of objects using ordinal numbers up to 20th. Determine the place value of a digit in a 3-digit number, the value of a digit, and the digit of a number given its place value.', ''],
  ['BOW-G2-MATH-T1-W8', 'Grade 2', 'Mathematics', 'First Term', 'Week 8', 'Number and Algebra', FIRST_TERM_CONTENT_STANDARD, FIRST_TERM_PERFORMANCE_STANDARD, 'Illustrate addition of 2-digit and by 1-digit numbers as counting up on the number line. Add numbers with sums up to 1000 in expanded form. Add numbers with sums up to 1000, with or without regrouping.', ''],
  ['BOW-G2-MATH-T1-W9', 'Grade 2', 'Mathematics', 'First Term', 'Week 9', 'Number and Algebra', FIRST_TERM_CONTENT_STANDARD, FIRST_TERM_PERFORMANCE_STANDARD, 'Add numbers with sums up to 1000, with or without regrouping. Illustrate and apply the properties of addition using sums up to 1000. Determine and write the value of bills, coins, or combinations of bills and coins up to PHP 1000.', ''],
  ['BOW-G2-MATH-T1-W10', 'Grade 2', 'Mathematics', 'First Term', 'Week 10', 'Number and Algebra', FIRST_TERM_CONTENT_STANDARD, FIRST_TERM_PERFORMANCE_STANDARD, 'Compare the values of different denominations of peso coins and bills up to PHP 1000. Solve problems involving addition with sums up to 1000, including problems involving money, with and without regrouping.', ''],
  ['BOW-G2-MATH-T2-W1', 'Grade 2', 'Mathematics', 'Second Term', 'Week 1', 'Measurement and Geometry', SECOND_TERM_CONTENT_STANDARD, SECOND_TERM_PERFORMANCE_STANDARD, 'Measure and compare lengths of objects, in meters or centimeters, and distance in meters, using appropriate measuring tools. Identify and use the appropriate unit to measure the length of an object and the distance between two locations.', ''],
  ['BOW-G2-MATH-T2-W2', 'Grade 2', 'Mathematics', 'Second Term', 'Week 2', 'Measurement and Geometry', SECOND_TERM_CONTENT_STANDARD, SECOND_TERM_PERFORMANCE_STANDARD, 'Estimate length using meters or centimeters, and distance using meters. Solve problems involving length and distance.', ''],
  ['BOW-G2-MATH-T2-W3', 'Grade 2', 'Mathematics', 'Second Term', 'Week 3', 'Number and Algebra', SECOND_TERM_CONTENT_STANDARD, SECOND_TERM_PERFORMANCE_STANDARD, 'Illustrate subtraction of 2-digit by 1-digit on the number line and as an inverse of addition. Subtract numbers where both numbers are less than 100 with regrouping. Solve problems involving subtraction where both numbers are less than 100, with and without regrouping.', ''],
  ['BOW-G2-MATH-T2-W4', 'Grade 2', 'Mathematics', 'Second Term', 'Week 4', 'Number and Algebra', SECOND_TERM_CONTENT_STANDARD, SECOND_TERM_PERFORMANCE_STANDARD, 'Subtract numbers where both numbers are less than 1000, with and without regrouping.', ''],
  ['BOW-G2-MATH-T2-W5', 'Grade 2', 'Mathematics', 'Second Term', 'Week 5', 'Number and Algebra', SECOND_TERM_CONTENT_STANDARD, SECOND_TERM_PERFORMANCE_STANDARD, 'Solve 1- and 2-step problems involving subtraction where both numbers are less than 1000, including problems involving money, with and without regrouping.', ''],
  ['BOW-G2-MATH-T2-W6', 'Grade 2', 'Mathematics', 'Second Term', 'Week 6', 'Number and Algebra', SECOND_TERM_CONTENT_STANDARD, SECOND_TERM_PERFORMANCE_STANDARD, 'Determine the next term/s in increasing or decreasing patterns, such as numbers, letters, rhythmic properties, visual elements in arts, and repetitions.', ''],
  ['BOW-G2-MATH-T2-W7', 'Grade 2', 'Mathematics', 'Second Term', 'Week 7', 'Number and Algebra', SECOND_TERM_CONTENT_STANDARD, SECOND_TERM_PERFORMANCE_STANDARD, 'Create increasing or decreasing patterns.', ''],
  ['BOW-G2-MATH-T2-W8', 'Grade 2', 'Mathematics', 'Second Term', 'Week 8', 'Data and Probability', SECOND_TERM_CONTENT_STANDARD, SECOND_TERM_PERFORMANCE_STANDARD, 'Present raw data, or data in tabular form, in a pictograph with a scale, or vice versa. Interpret data in tabular form and in a pictograph with or without a scale.', ''],
  ['BOW-G2-MATH-T2-W9', 'Grade 2', 'Mathematics', 'Second Term', 'Week 9', 'Data and Probability / Number and Algebra', SECOND_TERM_CONTENT_STANDARD, SECOND_TERM_PERFORMANCE_STANDARD, 'Present raw data, or data in tabular form, in a pictograph with a scale, or vice versa. Interpret data in tabular form and in a pictograph with or without a scale. Count concrete objects in a group by repeated addition and create equal groups using language such as "5 groups of 3" and "5 threes".', ''],
  ['BOW-G2-MATH-T2-W10', 'Grade 2', 'Mathematics', 'Second Term', 'Week 10', 'Number and Algebra', SECOND_TERM_CONTENT_STANDARD, SECOND_TERM_PERFORMANCE_STANDARD, 'Illustrate and write multiplication as repeated addition using concrete and pictorial models and numerals, groups of equal quantities, arrays, counting by multiples, and equal jumps on a number line.', ''],
  ['BOW-G2-MATH-T3-W1', 'Grade 2', 'Mathematics', 'Third Term', 'Week 1', 'Number and Algebra', THIRD_TERM_CONTENT_STANDARD, THIRD_TERM_PERFORMANCE_STANDARD, 'Multiply numbers using the 2, 3, 4, 5, and 10 multiplication tables.', ''],
  ['BOW-G2-MATH-T3-W2', 'Grade 2', 'Mathematics', 'Third Term', 'Week 2', 'Number and Algebra', THIRD_TERM_CONTENT_STANDARD, THIRD_TERM_PERFORMANCE_STANDARD, 'Solve multiplication problems using the 2, 3, 4, 5, and 10 multiplication tables, including problems involving money. Illustrate division through equal distribution of a number of objects into several groups.', ''],
  ['BOW-G2-MATH-T3-W3', 'Grade 2', 'Mathematics', 'Third Term', 'Week 3', 'Number and Algebra', THIRD_TERM_CONTENT_STANDARD, THIRD_TERM_PERFORMANCE_STANDARD, 'Illustrate and write division expressions using concrete and pictorial models and numerals, modelling division as equal sharing or formation of equal groups of objects and repeated subtraction. Divide numbers using the 2, 3, 4, 5, and 10 multiplication tables.', ''],
  ['BOW-G2-MATH-T3-W4', 'Grade 2', 'Mathematics', 'Third Term', 'Week 4', 'Number and Algebra', THIRD_TERM_CONTENT_STANDARD, THIRD_TERM_PERFORMANCE_STANDARD, 'Find the missing number in a number sentence involving multiplication or division by 2, 3, 4, 5, and 10. Distinguish even and odd numbers using division by 2. Solve division problems using the multiplication tables, including problems involving money.', ''],
  ['BOW-G2-MATH-T3-W5', 'Grade 2', 'Mathematics', 'Third Term', 'Week 5', 'Number and Algebra', THIRD_TERM_CONTENT_STANDARD, THIRD_TERM_PERFORMANCE_STANDARD, 'Represent and identify unit fractions with denominators 2, 3, 4, 5, 6, and 8. Read and write unit fractions in fraction notation.', ''],
  ['BOW-G2-MATH-T3-W6', 'Grade 2', 'Mathematics', 'Third Term', 'Week 6', 'Number and Algebra', THIRD_TERM_CONTENT_STANDARD, THIRD_TERM_PERFORMANCE_STANDARD, 'Order unit fractions from smallest to largest, and vice versa. Represent and identify similar fractions with denominators 2, 3, 4, 5, 6, and 8 using groups of objects, fraction charts, fraction tiles, and the number line.', ''],
  ['BOW-G2-MATH-T3-W7', 'Grade 2', 'Mathematics', 'Third Term', 'Week 7', 'Number and Algebra / Measurement and Geometry', THIRD_TERM_CONTENT_STANDARD, THIRD_TERM_PERFORMANCE_STANDARD, 'Read and write similar fractions in fraction notation. Order similar fractions from smallest to largest, and vice versa. Describe the duration of an event in terms of number of days and/or weeks using a calendar.', ''],
  ['BOW-G2-MATH-T3-W8', 'Grade 2', 'Mathematics', 'Third Term', 'Week 8', 'Measurement and Geometry', THIRD_TERM_CONTENT_STANDARD, THIRD_TERM_PERFORMANCE_STANDARD, 'Read and write time in hours and minutes, with a.m. and p.m., using an analog clock.', ''],
  ['BOW-G2-MATH-T3-W9', 'Grade 2', 'Mathematics', 'Third Term', 'Week 9', 'Measurement and Geometry', THIRD_TERM_CONTENT_STANDARD, THIRD_TERM_PERFORMANCE_STANDARD, 'Solve problems involving elapsed time, including minutes in an hour, hours in a day, days in a week, and timetables. Identify and explain the difference between straight and curved lines, and flat and curved surfaces of 3-dimensional objects. Identify and measure the perimeter of a plane figure using appropriate tools.', ''],
  ['BOW-G2-MATH-T3-W10', 'Grade 2', 'Mathematics', 'Third Term', 'Week 10', 'Measurement and Geometry', THIRD_TERM_CONTENT_STANDARD, THIRD_TERM_PERFORMANCE_STANDARD, 'Find the perimeter of triangles, squares, and rectangles. Solve problems involving the perimeter of triangles, squares, and rectangles.', '']
];
