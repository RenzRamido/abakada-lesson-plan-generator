function sendQueuedEmail_(job) {
  var body = [
    'Hi ' + (job.TeacherName || 'Teacher') + ',',
    '',
    'Your request for a ' + job.GradeLevel + ' ' + job.Subject + ' ' + job.Term + ' lesson plan has been received and added to the processing queue.',
    '',
    'Grade and Section: ' + gradeAndSection_(job),
    'School Year: ' + job.SchoolYear,
    'Subject: ' + job.Subject,
    'Term: ' + job.Term,
    '',
    'The system is preparing one editable Google Doc covering the full term. You will receive another email once the completed document is ready.',
    '',
    'Thank you for your patience.',
    '',
    getSystemName_()
  ].join('\n');

  MailApp.sendEmail({
    to: job.TeacherEmail,
    subject: 'Your ABAKADA Lesson Plan Request Was Received',
    body: body
  });
}

function sendCompletionEmail_(job) {
  var bowRecords = getBowRecordsForTerm_(job.GradeLevel, job.Subject, job.Term);
  var calendar = resolveTermCalendar_(job.GradeLevel, job.Subject, job.Term, bowRecords);
  assertJobCalendarSnapshot_(job, calendar);
  bowRecords = calendar.orderedBowRecords;
  var bodyLines = [
    'Hi ' + (job.TeacherName || 'Teacher') + ',',
    '',
    'Your full-term lesson plan is complete.',
    '',
    'Grade and Section: ' + gradeAndSection_(job),
    'Subject: ' + job.Subject,
    'Term: ' + job.Term,
    'School Year: ' + job.SchoolYear,
    'Teaching Days: ' + job.TotalTeachingDays,
    '',
    'Editable Google Doc:',
    job.GeneratedDocLink,
    ''
  ];

  if (calendar.mode === 'official_fixed') {
    bodyLines.splice(9, 0,
      'Official BOW Week Range: ' + formatOfficialWeekRange_(calendar),
      'Pacing Basis: ' + OFFICIAL_FIXED_PACING_BASIS_
    );
  }

  if (hasConstructedPacingBowNotice_(bowRecords)) {
    bodyLines = bodyLines.concat(getConstructedPacingEmailNoticeLines_(bowRecords));
  }

  var body = bodyLines.concat([
    'Please review, revise, and validate the AI-assisted lesson plan before classroom use.',
    '',
    getSystemName_()
  ]).join('\n');

  MailApp.sendEmail({
    to: job.TeacherEmail,
    subject: 'Your Full-Term ABAKADA Lesson Plan Is Ready',
    body: body
  });
}

function sendUnsupportedEmail_(job, reason) {
  var body = [
    'Hi ' + (job.TeacherName || 'Teacher') + ',',
    '',
    'Thank you for submitting a lesson plan request.',
    '',
    'The selected grade, subject, or term is not yet supported, so no document was generated.',
    '',
    'Selected request:',
    'Grade: ' + job.GradeLevel,
    'Subject: ' + job.Subject,
    'Term: ' + job.Term,
    '',
    'Reason:',
    reason,
    '',
    getSystemName_()
  ].join('\n');

  MailApp.sendEmail({
    to: job.TeacherEmail,
    subject: 'Lesson Plan Selection Is Not Yet Supported',
    body: body
  });
}

function sendDuplicateActiveEmail_(rowData, existingJob, message) {
  var status = existingJob.Status || 'Completed';
  var link = existingJob.GeneratedDocLink ? '\nExisting Google Doc:\n' + existingJob.GeneratedDocLink + '\n' : '';
  var body = [
    'Hi ' + (rowData.TeacherName || 'Teacher') + ',',
    '',
    message || 'The same full-term lesson plan request is already queued or being generated.',
    '',
    'Existing status: ' + status,
    link,
    'Request:',
    'Grade and Section: ' + gradeAndSection_(rowData),
    'Subject: ' + rowData.Subject,
    'Term: ' + rowData.Term,
    'School Year: ' + rowData.SchoolYear,
    '',
    'No additional document was generated for this duplicate request.',
    '',
    getSystemName_()
  ].join('\n');

  MailApp.sendEmail({
    to: rowData.TeacherEmail,
    subject: 'Duplicate ABAKADA Lesson Plan Request',
    body: body
  });
}

function sendAdminFailureEmail_(jobLike) {
  var adminEmail = getConfigValue('ADMIN_EMAIL', '');
  if (!adminEmail) {
    return;
  }

  var body = [
    'An ABAKADA lesson-plan job needs admin attention.',
    '',
    'JobID: ' + (jobLike.JobID || ''),
    'SubmissionID: ' + (jobLike.SubmissionID || ''),
    'Teacher email: ' + (jobLike.TeacherEmail || ''),
    'Grade: ' + (jobLike.GradeLevel || ''),
    'Subject: ' + (jobLike.Subject || ''),
    'Term: ' + (jobLike.Term || ''),
    'Current day: ' + (jobLike.CurrentDay || ''),
    'Current phase: ' + (jobLike.CurrentPhase || ''),
    'Exact error message: ' + (jobLike.LastError || ''),
    'Timestamp: ' + now_()
  ].join('\n');

  MailApp.sendEmail({
    to: adminEmail,
    subject: 'ABAKADA Lesson Plan Generator Admin Attention Required',
    body: body
  });
}

function sendLessonPlanEmail(formRow, bowRecord, docInfo, exportInfo, duplicateWarning) {
  var body = [
    'Good day, Teacher ' + formRow.TeacherName + ',',
    '',
    'Your AI-assisted lesson plan has been generated.',
    '',
    duplicateWarning ? 'Note: ' + duplicateWarning + '\n' : '',
    'Editable Google Doc:',
    docInfo.docUrl,
    '',
    'Please review and revise the lesson plan before classroom use to ensure it matches your learners, school context, and teaching needs.',
    '',
    'This legacy email helper is not used by the full-term queue workflow.',
    '',
    getSystemName_()
  ].join('\n');

  MailApp.sendEmail({
    to: formRow.TeacherEmail,
    subject: 'Your AI-Assisted Lesson Plan is Ready',
    body: body
  });
}
