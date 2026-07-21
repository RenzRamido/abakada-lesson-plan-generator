var UNWANTED_FOOTER_PATTERNS = [
  'THIS\\s+ACTIVITY\\s+SHEET\\s+IS\\s+NOT\\s+FOR\\s+SALE\\s*\\.?',
  'DOWNLOAD\\s+AND\\s+REPRODUCE\\s*:?',
  '(https?\\s*:?\\s*/?\\s*/?\\s*)?www\\s*\\.\\s*tinyurl\\s*\\.\\s*com\\s*/\\s*LSUpdatesGuide',
  'https?\\s*:?\\s*/?\\s*/?\\s*\\[\\s*www\\s*\\.\\s*tinyurl\\s*\\.\\s*com\\s*/\\s*LSUpdatesGuide\\s*\\]\\s*\\(\\s*http\\s*://\\s*www\\s*\\.\\s*tinyurl\\s*\\.\\s*com\\s*/\\s*LSUpdatesGuide\\s*\\)'
];

function containsUnwantedFooterText_(value) {
  var text = String(value || '');
  var normalized = normalizeFooterTextForMatch_(text);
  if (
    normalized.indexOf('this activity sheet is not for sale') !== -1 ||
    normalized.indexOf('download and reproduce') !== -1 ||
    normalized.indexOf('tinyurl.com/lsupdatesguide') !== -1
  ) {
    return true;
  }

  return UNWANTED_FOOTER_PATTERNS.some(function (pattern) {
    return new RegExp(pattern, 'i').test(text);
  });
}

function normalizeFooterTextForMatch_(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/https?:\s*\/?\s*\/?\s*/g, 'https://')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s*\.\s*/g, '.')
    .replace(/\s+/g, ' ')
    .trim();
}

function removeUnwantedFooterTextFromDoc_(doc) {
  getDocumentContainers_(doc).forEach(function (entry) {
    cleanUnwantedFooterFromContainer_(entry.container, entry.removeBlankParagraphs);
  });
}

function getDocumentContainers_(doc) {
  var containers = [];
  if (doc.getBody()) {
    containers.push({ container: doc.getBody(), removeBlankParagraphs: false });
  }
  if (doc.getHeader()) {
    containers.push({ container: doc.getHeader(), removeBlankParagraphs: true });
  }
  if (doc.getFooter()) {
    containers.push({ container: doc.getFooter(), removeBlankParagraphs: true });
  }
  return containers;
}

function cleanUnwantedFooterFromContainer_(container, removeBlankParagraphs) {
  UNWANTED_FOOTER_PATTERNS.forEach(function (pattern) {
    container.replaceText(pattern, '');
  });
  if (removeBlankParagraphs) {
    removeBlankParagraphsRecursively_(container);
  }
}

function removeBlankParagraphsRecursively_(container) {
  if (!container || !container.getNumChildren) {
    return;
  }

  for (var i = container.getNumChildren() - 1; i >= 0; i--) {
    var child = container.getChild(i);
    var type = child.getType();

    if (type === DocumentApp.ElementType.PARAGRAPH) {
      var text = child.asParagraph().getText();
      if (!String(text || '').trim() && container.getNumChildren() > 1) {
        container.removeChild(child);
      }
    } else if (type === DocumentApp.ElementType.TABLE) {
      cleanTable_(child.asTable());
    } else if (child.getNumChildren) {
      removeBlankParagraphsRecursively_(child);
    }
  }
}

function cleanTable_(table) {
  for (var r = 0; r < table.getNumRows(); r++) {
    var row = table.getRow(r);
    for (var c = 0; c < row.getNumCells(); c++) {
      cleanUnwantedFooterFromContainer_(row.getCell(c), true);
    }
  }
}
