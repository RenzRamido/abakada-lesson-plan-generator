function exportLessonPlanFiles(docId, fileBaseName) {
  var folder = getOutputFolder_();
  var pdfBlob = exportGoogleDoc_(docId, 'application/pdf', fileBaseName + '.pdf');
  var docxBlob = exportGoogleDoc_(docId, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', fileBaseName + '.docx');

  var pdfFile = folder.createFile(pdfBlob);
  var docxFile = folder.createFile(docxBlob);

  return {
    pdfFileId: pdfFile.getId(),
    pdfUrl: pdfFile.getUrl(),
    docxFileId: docxFile.getId(),
    docxUrl: docxFile.getUrl()
  };
}

function exportGoogleDoc_(docId, mimeType, fileName) {
  var url = 'https://www.googleapis.com/drive/v3/files/' + encodeURIComponent(docId) +
    '/export?mimeType=' + encodeURIComponent(mimeType);

  var response = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    },
    muteHttpExceptions: true
  });

  var statusCode = response.getResponseCode();
  if (statusCode < 200 || statusCode >= 300) {
    throw new Error('Drive export failed with HTTP ' + statusCode + ': ' + truncate_(response.getContentText(), 1000));
  }

  return response.getBlob().setName(fileName);
}

