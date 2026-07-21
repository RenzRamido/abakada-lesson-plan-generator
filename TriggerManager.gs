function installOrRepairTriggers() {
  setupOrUpgradeProject();

  var created = [];
  var formSubmitTriggers = getProjectTriggersByHandlerAndType_('onFormSubmit', ScriptApp.EventType.ON_FORM_SUBMIT);
  var workerTriggers = getProjectTriggersByHandlerAndType_('processGenerationQueue', ScriptApp.EventType.CLOCK);

  if (!formSubmitTriggers.length) {
    ScriptApp.newTrigger('onFormSubmit')
      .forSpreadsheet(SpreadsheetApp.getActive())
      .onFormSubmit()
      .create();
    created.push('Spreadsheet form-submit trigger: onFormSubmit');
  }

  if (!workerTriggers.length) {
    ScriptApp.newTrigger('processGenerationQueue')
      .timeBased()
      .everyMinutes(getWorkerIntervalMinutes_())
      .create();
    created.push('Time-driven worker trigger: processGenerationQueue every ' + getWorkerIntervalMinutes_() + ' minute(s)');
  }

  formSubmitTriggers = getProjectTriggersByHandlerAndType_('onFormSubmit', ScriptApp.EventType.ON_FORM_SUBMIT);
  workerTriggers = getProjectTriggersByHandlerAndType_('processGenerationQueue', ScriptApp.EventType.CLOCK);

  var message = [
    created.length ? 'Created:' : 'No new triggers were needed.',
    created.length ? created.join('\n') : '',
    '',
    'Existing onFormSubmit triggers: ' + formSubmitTriggers.length,
    'Existing processGenerationQueue worker triggers: ' + workerTriggers.length,
    '',
    'Unrelated triggers were not changed.'
  ].join('\n');

  SpreadsheetApp.getUi().alert(message);
}

function getProjectTriggersByHandlerAndType_(handlerName, eventType) {
  return ScriptApp.getProjectTriggers().filter(function (trigger) {
    return trigger.getHandlerFunction() === handlerName && trigger.getEventType() === eventType;
  });
}

function getTriggerCounts_() {
  return {
    formSubmit: getProjectTriggersByHandlerAndType_('onFormSubmit', ScriptApp.EventType.ON_FORM_SUBMIT).length,
    worker: getProjectTriggersByHandlerAndType_('processGenerationQueue', ScriptApp.EventType.CLOCK).length
  };
}
