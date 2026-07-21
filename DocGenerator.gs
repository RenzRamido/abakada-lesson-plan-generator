function createTermLessonPlanDocument_(job, bowRecords) {
  var fileBaseName = buildTermLessonFileName_(job);
  var calendar = resolveTermCalendar_(job.GradeLevel, job.Subject, job.Term, bowRecords);
  assertJobCalendarSnapshot_(job, calendar);
  bowRecords = calendar.orderedBowRecords;
  var templateId = getConfigValue('TEMPLATE_DOC_ID', '');
  var folder = getOutputFolder_();
  var doc;
  var file;

  if (templateId) {
    file = DriveApp.getFileById(templateId).makeCopy(fileBaseName, folder);
    doc = DocumentApp.openById(file.getId());
    removeUnwantedFooterTextFromDoc_(doc);
  } else {
    doc = DocumentApp.create(fileBaseName);
    file = DriveApp.getFileById(doc.getId());
    file.moveTo(folder);
  }

  buildTermDocumentStart_(doc, job, bowRecords, calendar);
  removeUnwantedFooterTextFromDoc_(doc);
  doc.saveAndClose();

  return {
    docId: doc.getId(),
    docUrl: doc.getUrl(),
    fileBaseName: fileBaseName
  };
}

function buildTermDocumentStart_(doc, job, bowRecords, calendar) {
  calendar = calendar || resolveTermCalendar_(job.GradeLevel, job.Subject, job.Term, bowRecords);
  assertJobCalendarSnapshot_(job, calendar);
  var body = doc.getBody();
  // Template copies keep header/footer and document shell; the generated term body is rebuilt once.
  var bodyAttributes = body.getAttributes();
  body.clear();
  body.setAttributes(bodyAttributes);

  appendFormalDocumentHeader_(body, job);

  body.appendParagraph(getSystemName_()).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Full-Term ILAW Lesson Plan').setHeading(DocumentApp.ParagraphHeading.HEADING2);

  var requestDetails = [
    ['Teacher', job.TeacherName || 'Not specified'],
    ['Email', job.TeacherEmail || 'Not specified'],
    ['School', job.SchoolName || 'Not specified'],
    ['School Year', job.SchoolYear || 'Not specified'],
    ['Grade and Class Section', gradeAndSection_(job)],
    ['Subject and Term', (job.Subject || '') + ' - ' + (job.Term || '')],
    ['Total Teaching Days', String(job.TotalTeachingDays || getTermDayCount_(job.Term))],
    ['Class Learning Ability', job.ClassLearningAbility || 'Not specified'],
    ['Learner Context', job.LearnerContext || 'Not specified'],
    ['Available Materials', job.AvailableMaterials || 'Not specified'],
    ['Preferred Teaching Strategy', job.PreferredTeachingStrategy || 'Not specified'],
    ['Preferred Language', job.PreferredLanguage || 'English']
  ];
  if (calendar.mode === 'official_fixed') {
    requestDetails.push(['Official BOW Week Range', formatOfficialWeekRange_(calendar)]);
    requestDetails.push(['Pacing Basis', OFFICIAL_FIXED_PACING_BASIS_]);
  }
  appendKeyValueTable_(body, requestDetails);

  if (hasConstructedPacingBowNotice_(bowRecords)) {
    body.appendParagraph('Curriculum Mapping Note:').setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendParagraph(getConstructedPacingDocNotice_(bowRecords));
  } else if (calendar.mode === 'official_fixed') {
    body.appendParagraph('Curriculum Mapping Note:').setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendParagraph('Official competencies and official weekly pacing from the curriculum source files were used.');
  }

  if (job.SpecialInstructions) {
    body.appendParagraph('Special Instructions').setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendParagraph(job.SpecialInstructions);
  }

  body.appendParagraph('Declaration of AI Use').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph(defaultAiDeclaration_());

  body.appendParagraph('Term Content Standard').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  appendUniqueParagraphs_(body, bowRecords.map(function (record) { return record.ContentStandard; }));

  body.appendParagraph('Term Performance Standard').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  appendUniqueParagraphs_(body, bowRecords.map(function (record) { return record.PerformanceStandard; }));

  body.appendParagraph('Term BOW Competency Overview').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  appendBowOverviewTable_(body, bowRecords, calendar);

  body.appendParagraph('Term Learning Progression Overview').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph('The daily plan below is generated from a locked term-day plan. Each day is appended after validation, and the teacher should review, revise, and validate all AI-assisted content before classroom use.');
}

function appendGeneratedContentsIndex_(docId, termRows) {
  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();
  if (body.findText('Generated Contents Index')) {
    doc.saveAndClose();
    return;
  }

  body.appendPageBreak();
  body.appendParagraph('Generated Contents Index').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  termRows.forEach(function (row) {
    var coveredIds = getCoveredBowIdsForDay_(row);
    body.appendParagraph(
      'Day ' + row.DayNumber + ' - ' + row.LessonTitle +
      ' (' + row.DayType + ', ' + coveredIds.join(', ') + ')'
    );
  });
  removeUnwantedFooterTextFromDoc_(doc);
  doc.saveAndClose();
}

function appendDailyLessonToDocument_(docId, job, dayPlan, lesson) {
  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();
  var displayBowRecords = getDayDocumentBowRecords_(dayPlan, lesson);
  var pacingMetadataIndex = buildBowPacingMetadataIndex_(loadBowPacingMetadataRows_());
  var dayMarker = 'Day ' + dayPlan.DayNumber + ':';
  var startMarker = getDayStartMarker_(dayPlan);
  var completeMarker = getDayCompleteMarker_(dayPlan);

  if (body.findText(escapeRegExp_(completeMarker))) {
    removeUnwantedFooterTextFromDoc_(doc);
    doc.saveAndClose();
    return { alreadyAppended: true };
  }

  if (body.findText(escapeRegExp_(startMarker))) {
    removeDocumentTailFromMarker_(body, startMarker);
  }

  if (Number(dayPlan.DayNumber) > 1) {
    body.appendPageBreak();
  } else {
    body.appendPageBreak();
  }

  appendInternalMarker_(body, startMarker);
  body.appendParagraph(dayMarker + ' ' + (lesson.lessonTitle || dayPlan.LessonTitle)).setHeading(DocumentApp.ParagraphHeading.HEADING2);
  appendKeyValueTable_(body, [
    ['BOW Week', displayBowRecords.map(function (record) {
      return getBowDisplayWeekLabel_(record, pacingMetadataIndex);
    }).join('\n')],
    ['BOW ID', displayBowRecords.map(function (record) { return record.BOW_ID; }).join('\n')],
    ['Domain', displayBowRecords.map(function (record) { return record.Domain; }).join('\n')],
    ['Learning Competency', displayBowRecords.map(function (record) { return record.LearningCompetency; }).join('\n')],
    ['Day Type', dayPlan.DayType]
  ]);

  body.appendParagraph('Learning Objectives').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  appendBullets_(body, lesson.learningObjectives);

  body.appendParagraph('Pre-Lesson').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph(lesson.preLesson || 'To be reviewed and completed by the teacher.');

  body.appendParagraph('Learning Flow').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph(lesson.timeAdjustmentNote || getTimeAdjustmentNote_());
  appendDailyFlowTable_(body, lesson.learningFlow);

  body.appendParagraph('Learning Resources').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  appendBullets_(body, lesson.learningResources);

  body.appendParagraph('Opportunities for Integration').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph(lesson.opportunitiesForIntegration || 'To be reviewed and completed by the teacher.');

  body.appendParagraph('Formative Assessment').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  appendAssessment_(body, lesson.formativeAssessment);

  body.appendParagraph('Answer Key').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  appendBullets_(body, lesson.formativeAssessment && lesson.formativeAssessment.answerKey);

  body.appendParagraph('Compact Remediation').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph(lesson.compactRemediation || 'To be adjusted by the teacher.');

  body.appendParagraph('Compact Enrichment').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph(lesson.compactEnrichment || 'To be adjusted by the teacher.');

  body.appendParagraph('Assumed Reflection').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph(lesson.suggestedReflection || 'Suggested editable reflection: The teacher may revise this after actual classroom implementation.');

  body.appendParagraph('Teacher Additional Reflection').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph('---');
  body.appendParagraph('---');
  body.appendParagraph('---');
  appendInternalMarker_(body, completeMarker);

  removeUnwantedFooterTextFromDoc_(doc);
  doc.saveAndClose();
  return { alreadyAppended: false };
}

function getDayDocumentBowRecords_(dayPlan, lesson) {
  if (lesson && Array.isArray(lesson._coveredBowRecords) && lesson._coveredBowRecords.length) {
    return lesson._coveredBowRecords;
  }
  return [{
    WeekNumber: dayPlan.BOWWeek || '',
    BOW_ID: dayPlan.BOW_ID || '',
    Domain: dayPlan.Domain || '',
    LearningCompetency: dayPlan.LearningCompetency || ''
  }];
}

function isDayAlreadyInDocument_(docId, dayPlan) {
  if (!docId) {
    return false;
  }

  var doc = DocumentApp.openById(docId);
  var found = !!doc.getBody().findText(escapeRegExp_(getDayCompleteMarker_(dayPlan)));
  doc.saveAndClose();
  return found;
}

function hasIncompleteDayStartInDocument_(docId, dayPlan) {
  if (!docId) {
    return false;
  }

  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();
  var hasStart = !!body.findText(escapeRegExp_(getDayStartMarker_(dayPlan)));
  var hasComplete = !!body.findText(escapeRegExp_(getDayCompleteMarker_(dayPlan)));
  doc.saveAndClose();
  return hasStart && !hasComplete;
}

function getDayStartMarker_(dayPlan) {
  return '[[ABAKADA_DAY_' + padDayNumber_(dayPlan.DayNumber) + '_START]]';
}

function getDayCompleteMarker_(dayPlan) {
  return '[[ABAKADA_DAY_' + padDayNumber_(dayPlan.DayNumber) + '_COMPLETE]]';
}

function padDayNumber_(dayNumber) {
  var text = '000' + Number(dayNumber || 0);
  return text.substring(text.length - 3);
}

function appendInternalMarker_(body, marker) {
  var paragraph = body.appendParagraph(marker);
  paragraph.editAsText().setForegroundColor('#ffffff').setFontSize(1);
}

function removeDocumentTailFromMarker_(body, marker) {
  var range = body.findText(escapeRegExp_(marker));
  if (!range) {
    return false;
  }

  var child = getBodyChildForRange_(body, range);
  if (!child) {
    return false;
  }

  var childIndex = body.getChildIndex(child);
  for (var i = body.getNumChildren() - 1; i >= childIndex; i--) {
    body.removeChild(body.getChild(i));
  }

  return true;
}

function getBodyChildForRange_(body, range) {
  var element = range.getElement();
  while (element && element.getParent && element.getParent() !== body) {
    element = element.getParent();
  }
  return element && element.getParent && element.getParent() === body ? element : null;
}

function removeInternalMarkersFromDoc_(docId) {
  var doc = DocumentApp.openById(docId);
  var dayPattern = '\\[\\[ABAKADA_DAY_[0-9]{3}_(START|COMPLETE)\\]\\]';
  var finalAssessmentPattern = '\\[\\[ABAKADA_FINAL_ASSESSMENT_(START|COMPLETE)\\]\\]';
  var containers = [];
  if (doc.getBody()) {
    containers.push(doc.getBody());
  }
  if (doc.getHeader()) {
    containers.push(doc.getHeader());
  }
  if (doc.getFooter()) {
    containers.push(doc.getFooter());
  }

  containers.forEach(function (container) {
    container.replaceText(dayPattern, '');
    container.replaceText(finalAssessmentPattern, '');
  });
  doc.saveAndClose();
}

function appendTermClosingSections_(docId, job) {
  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();
  if (body.findText('Teacher Notes Pages')) {
    removeUnwantedFooterTextFromDoc_(doc);
    doc.saveAndClose();
    return;
  }

  body.appendPageBreak();
  body.appendParagraph('Teacher Notes Pages').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph('Editable space for summative assessment notes, remediation notes, enrichment notes, and final learner progress observations after actual classroom use.');
  for (var i = 0; i < 6; i++) {
    body.appendParagraph('---');
  }

  removeUnwantedFooterTextFromDoc_(doc);
  doc.saveAndClose();
}

function appendFormalDocumentHeader_(body, job) {
  appendCenteredHeaderLine_(body, 'Republic of the Philippines');
  appendCenteredHeaderLine_(body, 'Department of Education');
  appendCenteredHeaderLine_(body, getConfigValue('DEFAULT_SCHOOL_HEADER', ''));
  appendCenteredHeaderLine_(body, getConfigValue('DEPED_REGION', ''));
  appendCenteredHeaderLine_(body, getConfigValue('SCHOOLS_DIVISION', ''));
  appendCenteredHeaderLine_(body, getConfigValue('SUB_OFFICE', ''));

  var schoolName = String(job && job.SchoolName ? job.SchoolName : '').trim();
  if (schoolName && normalizeForMatch_(schoolName) !== 'not specified') {
    appendCenteredHeaderLine_(body, schoolName);
  }
  body.appendParagraph('');
}

function appendCenteredHeaderLine_(body, value) {
  var text = String(value || '').trim();
  if (!text) {
    return;
  }
  body.appendParagraph(text).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
}

function appendFinalAssessmentToDocument_(docId, job, assessment) {
  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();
  var startMarker = getFinalAssessmentStartMarker_();
  var completeMarker = getFinalAssessmentCompleteMarker_();

  if (body.findText(escapeRegExp_(completeMarker))) {
    removeUnwantedFooterTextFromDoc_(doc);
    doc.saveAndClose();
    return { alreadyAppended: true };
  }

  if (body.findText(escapeRegExp_(startMarker))) {
    removeDocumentTailFromMarker_(body, startMarker);
  }

  body.appendPageBreak();
  appendInternalMarker_(body, startMarker);
  body.appendParagraph('Final Term Assessment').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(assessment.assessmentTitle || 'Final Term Assessment Draft').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  appendKeyValueTable_(body, [
    ['Assessment Focus', (job.Subject || '') + ' - ' + (job.Term || '')],
    ['Grade and Section', gradeAndSection_(job)],
    ['School Year', job.SchoolYear || 'Not specified'],
    ['Language Used', assessment.languageUsed || job.PreferredLanguage || 'English'],
    ['Suggested Use', 'Review, revise, and validate based on school assessment policies and learner needs.']
  ]);

  body.appendParagraph('Directions').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph(assessment.directions || 'To be reviewed and completed by the teacher.');

  body.appendParagraph('Coverage Summary').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph(assessment.coverageSummary || 'Aligned to the selected term Budget of Work records.');

  body.appendParagraph('Written Assessment').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  appendFinalAssessmentItems_(body, assessment.writtenAssessment && assessment.writtenAssessment.items);

  body.appendParagraph('Answer Key').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  appendFinalAssessmentAnswerKey_(body, assessment.writtenAssessment && assessment.writtenAssessment.answerKey);

  body.appendParagraph('Performance or Application Task').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  appendPerformanceTask_(body, assessment.performanceTask);

  body.appendParagraph('Teacher Notes').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph(assessment.teacherNotes || 'Teacher may revise this assessment before classroom use.');
  appendInternalMarker_(body, completeMarker);

  removeUnwantedFooterTextFromDoc_(doc);
  doc.saveAndClose();
  return { alreadyAppended: false };
}

function isFinalAssessmentAlreadyInDocument_(docId) {
  if (!docId) {
    return false;
  }
  var doc = DocumentApp.openById(docId);
  var found = !!doc.getBody().findText(escapeRegExp_(getFinalAssessmentCompleteMarker_()));
  doc.saveAndClose();
  return found;
}

function hasIncompleteFinalAssessmentStartInDocument_(docId) {
  if (!docId) {
    return false;
  }
  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();
  var hasStart = !!body.findText(escapeRegExp_(getFinalAssessmentStartMarker_()));
  var hasComplete = !!body.findText(escapeRegExp_(getFinalAssessmentCompleteMarker_()));
  doc.saveAndClose();
  return hasStart && !hasComplete;
}

function isFinalAssessmentSectionPresent_(docId) {
  if (!docId) {
    return false;
  }
  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();
  var found = !!body.findText('Final Term Assessment') &&
    !!body.findText('Written Assessment') &&
    !!body.findText('Performance or Application Task');
  doc.saveAndClose();
  return found;
}

function getFinalAssessmentStartMarker_() {
  return '[[ABAKADA_FINAL_ASSESSMENT_START]]';
}

function getFinalAssessmentCompleteMarker_() {
  return '[[ABAKADA_FINAL_ASSESSMENT_COMPLETE]]';
}

function appendFinalAssessmentItems_(body, items) {
  var rows = [['No.', 'Type', 'Item', 'Choices', 'Answer', 'Points']];
  (items || []).forEach(function (item) {
    rows.push([
      String(item.number || ''),
      item.itemType || '',
      item.prompt || '',
      Array.isArray(item.choices) ? item.choices.join('\n') : '',
      item.answer || '',
      String(item.points || '')
    ]);
  });
  body.appendTable(rows);
}

function appendFinalAssessmentAnswerKey_(body, answerKey) {
  var rows = [['No.', 'Answer', 'Explanation']];
  (answerKey || []).forEach(function (item) {
    rows.push([
      String(item.number || ''),
      item.answer || '',
      item.explanation || ''
    ]);
  });
  body.appendTable(rows);
}

function appendPerformanceTask_(body, task) {
  if (!task) {
    body.appendParagraph('To be reviewed and completed by the teacher.');
    return;
  }

  body.appendParagraph(task.title || 'Performance Task');
  body.appendParagraph(task.directions || '');
  body.appendParagraph(task.output || '');

  var rows = [['Criterion', 'Description', 'Points']];
  (task.criteria || []).forEach(function (criterion) {
    rows.push([
      criterion.criterion || '',
      criterion.description || '',
      String(criterion.points || '')
    ]);
  });
  body.appendTable(rows);
}

function shareDocumentWithTeacher_(docId, teacherEmail) {
  if (!teacherEmail) {
    throw createClassifiedError_('Teacher email is missing. Cannot share final Google Doc.', 'validation');
  }
  try {
    DriveApp.getFileById(docId).addEditor(teacherEmail);
  } catch (err) {
    throw createClassifiedError_('Document sharing failed for ' + teacherEmail + ': ' + (err && err.message ? err.message : String(err)), 'admin');
  }
}

function verifyCompletedTermDocument_(job, termRows) {
  var completed = termRows.filter(function (row) {
    return String(row.Status || '') === DAY_STATUS.COMPLETED;
  }).length;

  if (completed !== Number(job.TotalTeachingDays)) {
    throw createClassifiedError_('Completed day count mismatch. Expected ' + job.TotalTeachingDays + ', completed ' + completed + '.', 'validation');
  }
}

function appendUniqueParagraphs_(body, values) {
  var seen = {};
  (values || []).forEach(function (value) {
    var text = String(value || '').trim();
    if (text && !seen[text]) {
      body.appendParagraph(text);
      seen[text] = true;
    }
  });
}

function appendBowOverviewTable_(body, bowRecords, calendar) {
  var rows = [['Week', 'BOW ID', 'Domain', 'Learning Competency']];
  (bowRecords || []).forEach(function (record) {
    rows.push([
      getOfficialWeekLabelForBow_(record, calendar),
      record.BOW_ID || '',
      record.Domain || '',
      record.LearningCompetency || ''
    ]);
  });
  body.appendTable(rows);
}

function appendDailyFlowTable_(body, flow) {
  var rows = [['Phase', 'Teacher Activity', 'Learner Activity', 'Estimated Time', 'Notes or Accommodations']];
  (flow || []).forEach(function (item) {
    rows.push([
      item.phase || '',
      item.teacherActivity || '',
      item.learnerActivity || '',
      item.estimatedTime || '',
      item.notesOrAccommodations || ''
    ]);
  });

  body.appendTable(rows);
}

function gradeAndSection_(job) {
  var grade = job.GradeLevel || 'Grade';
  var section = job.ClassSection || 'Not specified';
  return section === 'Not specified' ? grade : grade + ' - ' + section;
}

function buildTermLessonFileName_(job) {
  var parts = [
    'ABAKADA Full-Term Lesson Plan',
    job.TeacherName,
    job.GradeLevel,
    job.ClassSection,
    job.Subject,
    job.Term,
    job.SchoolYear,
    job.JobID
  ];

  return sanitizeFileNameParts_(parts);
}

function createLessonPlanDocument(formRow, bowRecord, lessonPlan, duplicateWarning) {
  var fileBaseName = buildLessonFileName_(formRow, bowRecord);
  var folder = getOutputFolder_();
  var doc = DocumentApp.create(fileBaseName);
  var file = DriveApp.getFileById(doc.getId());
  file.moveTo(folder);
  buildDocumentFromScratch_(doc, formRow, bowRecord, lessonPlan, duplicateWarning);
  removeUnwantedFooterTextFromDoc_(doc);
  doc.saveAndClose();

  return {
    docId: doc.getId(),
    docUrl: doc.getUrl(),
    fileBaseName: fileBaseName
  };
}

function buildDocumentFromScratch_(doc, formRow, bowRecord, lessonPlan, duplicateWarning) {
  var body = doc.getBody();
  body.clear();

  appendFormalDocumentHeader_(body, formRow);

  body.appendParagraph('LESSON PLAN TEMPLATE').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph(lessonPlan.lessonTitle || 'AI-Assisted Lesson Plan').setHeading(DocumentApp.ParagraphHeading.HEADING2);

  appendKeyValueTable_(body, [
    ['Learning Area/s', lessonPlan.learningArea || formRow.Subject],
    ['Name of Teacher/s', lessonPlan.teacherName || formRow.TeacherName],
    ['School', formRow.SchoolName],
    ['Grade Level and Section', lessonPlan.gradeLevelAndSection || formRow.GradeLevel],
    ['No. of Sessions', lessonPlan.numberOfSessions || formRow.NumberOfSessions],
    ['Term and Week', formRow.Term + ', ' + formRow.WeekNumber],
    ['References', lessonPlan.references || 'Budget of Work record: ' + bowRecord.BOW_ID],
    ['Declaration of AI use', lessonPlan.aiDeclaration || defaultAiDeclaration_()]
  ]);

  if (duplicateWarning) {
    body.appendParagraph('Duplicate Notice').setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendParagraph(duplicateWarning);
  }

  body.appendParagraph('Intentions').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph('Learning Competency and Curriculum Standards').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph(lessonPlan.learningCompetencyAndStandards || bowRecord.LearningCompetency);
  body.appendParagraph('Learning Objectives').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  appendBullets_(body, lessonPlan.learningObjectives);
  body.appendParagraph('Learner Context').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph(lessonPlan.learnerContext || formRow.LearnerContext || 'To be reviewed and completed by the teacher.');
  body.appendParagraph('Learning Experience').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph('Pre-Lesson').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph(lessonPlan.preLesson || '');
  body.appendParagraph('Flow').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  appendFlowTable_(body, lessonPlan.flow);
  body.appendParagraph('Assessment').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  appendAssessment_(body, lessonPlan.formativeAssessment);
  body.appendParagraph('Teacher must review, revise, and validate the AI-assisted lesson plan before classroom use.');
}

function appendKeyValueTable_(body, rows) {
  var table = body.appendTable(rows);
  for (var r = 0; r < table.getNumRows(); r++) {
    table.getRow(r).getCell(0).editAsText().setBold(true);
  }
}

function appendBullets_(body, items) {
  var list = Array.isArray(items) && items.length ? items : ['To be reviewed and completed by the teacher.'];
  list.forEach(function (item) {
    body.appendListItem(String(item)).setGlyphType(DocumentApp.GlyphType.BULLET);
  });
}

function appendFlowTable_(body, flow) {
  var rows = [['Phase', 'Teacher Activity', 'Learner Activity', 'Estimated Time', 'Notes']];
  (flow || []).forEach(function (item) {
    rows.push([
      item.phase || '',
      item.teacherActivity || '',
      item.learnerActivity || '',
      item.estimatedTime || '',
      item.notes || ''
    ]);
  });

  body.appendTable(rows);
}

function appendAssessment_(body, assessment) {
  if (!assessment) {
    body.appendParagraph('To be reviewed and completed by the teacher.');
    return;
  }

  body.appendParagraph(assessment.instructions || '');
  appendBullets_(body, assessment.items);
}

function bulletText_(items) {
  if (!Array.isArray(items)) {
    return String(items || '');
  }
  return items.map(function (item) {
    return '- ' + item;
  }).join('\n');
}

function assessmentText_(assessment) {
  if (!assessment) {
    return '';
  }

  var parts = [assessment.instructions || ''];
  (assessment.items || []).forEach(function (item) {
    parts.push('- ' + item);
  });
  return parts.join('\n');
}

function defaultAiDeclaration_() {
  return 'AI was used to assist in organizing the lesson plan structure, drafting activities, and aligning the lesson to the selected Budget of Work competency. The teacher must review, revise, and validate the output before classroom use.';
}

function buildLessonFileName_(formRow, bowRecord) {
  return sanitizeFileNameParts_([
    'ILAW Lesson Plan',
    formRow.TeacherName,
    formRow.GradeLevel,
    formRow.Subject,
    formRow.Term,
    formRow.WeekNumber,
    bowRecord.BOW_ID
  ]);
}

function sanitizeFileNameParts_(parts) {
  return parts.map(function (part) {
    return String(part || '').replace(/[\\/:*?"<>|#%{}~&]/g, '').trim();
  }).filter(Boolean).join(' - ');
}
