const onOpen = (e) => {
  try {
    SpreadsheetApp.getUi()
      .createMenu('Guesty for Sheets')
      .addItem('Fetch Properties', 'fetchProperties')
      .addSeparator()
      .addItem('Help', 'showHelp')
      .addToUi();
  } catch (f) {
    Logger.log(f.message);
  }

  // create trigger
  try {
    const ssId = SpreadsheetApp.getActiveSpreadsheet().getId();
    ScriptApp.newTrigger('myFunction').forSpreadsheet(ssId).onEdit().create();
  } catch (err) {
    // TODO (developer) - Handle exception
    Logger.log('Failed with error %s', err.message);
  }
};

const showHelp = () => {
  const html = `<html><body><a href="https://github.com/kilbot/guesty-for-sheets/issues" target="blank" onclick="google.script.host.close()">GitHub Issues</a></body></html>`;
  const ui = HtmlService.createHtmlOutput(html);
  SpreadsheetApp.getUi().showModelessDialog(ui, 'Help');
};

const onInstall = (e) => {
  onOpen(e);
};

/**
 *
 */
const onSelectionChange = (e) => {
  Browser.msgBox(String(e));
  Logger.log('onSelectionChange', e);
};

/**
 *
 */
const myFunction = (e) => {
  Browser.msgBox(String(e));
  Logger.log('myFunction', e);
};

/**
 *
 */
const onEdit = (e) => {
  Browser.msgBox(String(e));
  Logger.log('onEdit', e);
};

global.onOpen = onOpen;
global.showHelp = showHelp;
global.onInstall = onInstall;
global.onSelectionChange = onSelectionChange;
global.myFunction = myFunction;
global.onEdit = onEdit;
