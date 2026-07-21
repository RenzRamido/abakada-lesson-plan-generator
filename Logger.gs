function logProcessing_(submissionId, jobId, status, message, rawError) {
  if (arguments.length === 4) {
    rawError = message;
    message = status;
    status = jobId;
    jobId = '';
  }

  var sheet = getSheetByName_(SHEET_NAMES.PROCESSING_LOG);
  appendMissingHeaders_(sheet, PROCESSING_LOG_HEADERS);
  appendObjectRow_(sheet, PROCESSING_LOG_HEADERS, {
    Timestamp: now_(),
    SubmissionID: submissionId || '',
    JobID: jobId || '',
    Status: status || '',
    Message: message || '',
    RawError: rawError || ''
  });
}
