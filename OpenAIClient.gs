function generateLessonPlanWithOpenAI(promptRequest) {
  return callOpenAIJson_(promptRequest);
}

function callOpenAIJson_(promptRequest) {
  var apiKey = getOpenAIApiKey_();
  var model = getConfigValue('OPENAI_MODEL', DEFAULT_CONFIG.OPENAI_MODEL);
  var maxOutputTokens = Number(getConfigValue('OPENAI_MAX_OUTPUT_TOKENS', DEFAULT_CONFIG.OPENAI_MAX_OUTPUT_TOKENS));
  var schemaName = promptRequest.schemaName || 'structured_response';

  var payload = {
    model: model,
    input: [
      {
        role: 'system',
        content: [{ type: 'input_text', text: promptRequest.systemPrompt }]
      },
      {
        role: 'user',
        content: [{ type: 'input_text', text: promptRequest.userPrompt }]
      }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: schemaName,
        schema: promptRequest.schema,
        strict: true
      }
    },
    // Do not store teacher/class context in OpenAI retention beyond request processing.
    store: false,
    max_output_tokens: maxOutputTokens
  };

  var response;
  try {
    response = UrlFetchApp.fetch('https://api.openai.com/v1/responses', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + apiKey
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (err) {
    throw createClassifiedError_('OpenAI request failed before a response was received: ' + (err && err.message ? err.message : String(err)), 'temporary');
  }

  var statusCode = response.getResponseCode();
  var responseText = response.getContentText();
  if (statusCode < 200 || statusCode >= 300) {
    throw classifyOpenAIHttpError_(statusCode, responseText);
  }

  var parsed;
  try {
    parsed = JSON.parse(responseText);
  } catch (err) {
    throw createClassifiedError_('OpenAI API returned non-JSON response metadata: ' + truncate_(responseText, 2000), 'temporary');
  }

  if (isOpenAIResponseIncomplete_(parsed)) {
    throw createClassifiedError_('OpenAI response appears incomplete or truncated: ' + truncate_(responseText, 2000), 'validation');
  }

  if (hasOpenAIRefusal_(parsed)) {
    throw createClassifiedError_('OpenAI refused the request: ' + truncate_(extractOpenAIRefusalText_(parsed), 2000), 'validation');
  }

  var outputText = extractOpenAIOutputText_(parsed);
  if (!outputText) {
    throw createClassifiedError_('OpenAI returned an empty response.', 'validation');
  }

  try {
    return JSON.parse(outputText);
  } catch (err) {
    throw createClassifiedError_('OpenAI response was not valid JSON: ' + truncate_(outputText, 3000), 'validation');
  }
}

function classifyOpenAIHttpError_(statusCode, responseText) {
  var text = String(responseText || '');
  var normalized = normalizeForMatch_(text);
  var message = 'OpenAI API error ' + statusCode + ': ' + truncate_(text, 2000);

  if (
    normalized.indexOf('insufficient_quota') !== -1 ||
    normalized.indexOf('billing') !== -1 ||
    normalized.indexOf('balance') !== -1 ||
    normalized.indexOf('invalid api key') !== -1 ||
    normalized.indexOf('incorrect api key') !== -1 ||
    normalized.indexOf('unauthorized') !== -1 ||
    statusCode === 401 ||
    statusCode === 403
  ) {
    return createClassifiedError_(message, 'admin');
  }

  if (statusCode === 408 || statusCode === 409 || statusCode === 429 || statusCode >= 500) {
    return createClassifiedError_(message, 'temporary');
  }

  return createClassifiedError_(message, 'validation');
}

function isOpenAIResponseIncomplete_(response) {
  if (!response) {
    return true;
  }
  if (response.status && String(response.status).toLowerCase() === 'incomplete') {
    return true;
  }
  if (response.status && ['failed', 'cancelled'].indexOf(String(response.status).toLowerCase()) !== -1) {
    return true;
  }
  if (response.incomplete_details) {
    return true;
  }
  if (response.error) {
    return true;
  }
  return false;
}

function hasOpenAIRefusal_(response) {
  return !!extractOpenAIRefusalText_(response);
}

function extractOpenAIRefusalText_(response) {
  var refusals = [];
  var output = response && response.output ? response.output : [];
  output.forEach(function (item) {
    var content = item.content || [];
    content.forEach(function (contentItem) {
      if (contentItem.type === 'refusal') {
        refusals.push(contentItem.refusal || contentItem.text || 'Refusal returned without message.');
      }
    });
  });
  return refusals.join('\n').trim();
}

function extractOpenAIOutputText_(response) {
  if (response.output_text) {
    return response.output_text;
  }

  var parts = [];
  var output = response.output || [];
  output.forEach(function (item) {
    var content = item.content || [];
    content.forEach(function (contentItem) {
      if (contentItem.type === 'output_text' && contentItem.text) {
        parts.push(contentItem.text);
      } else if (contentItem.type === 'text' && contentItem.text) {
        parts.push(contentItem.text);
      }
    });
  });

  return parts.join('\n').trim();
}

function isAdminOpenAIError_(err) {
  return !!(err && err.isAdminError);
}

function isTemporaryOpenAIError_(err) {
  return !!(err && err.isTemporaryError);
}

function testOpenAIConnection() {
  var promptRequest = {
    systemPrompt: 'Return only valid JSON.',
    userPrompt: 'Return {"ok":true,"message":"Connection works"}.',
    schemaName: 'connection_test',
    schema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        ok: { type: 'boolean' },
        message: { type: 'string' }
      },
      required: ['ok', 'message']
    }
  };

  var result = callOpenAIJson_(promptRequest);
  if (!result || result.ok !== true) {
    throw createClassifiedError_('OpenAI connection test returned unexpected JSON.', 'validation');
  }

  SpreadsheetApp.getUi().alert('OpenAI connection works.');
}
