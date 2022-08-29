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
  ScriptApp.newTrigger('myFunction').forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create();
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
  Logger.log('onSelectionChange', e);
};

/**
 *
 */
const myFunction = (e) => {
  Logger.log('myFunction', e);
};

global.onOpen = onOpen;
global.showHelp = showHelp;
global.onInstall = onInstall;
global.onSelectionChange = onSelectionChange;
global.myFunction = myFunction;
