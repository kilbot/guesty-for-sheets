const doGet = () => {
  const title = 'Google Apps Script';
  const fileName = 'index.html';
  return HtmlService.createHtmlOutputFromFile(fileName)
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
};

/**
 *
 */
const onEditorsHomepage = () => {
  Logger.log('onEditorsHomepage');
};

/**
 *
 */
const onFileScopeGrantedEditors = () => {
  Logger.log('onFileScopeGrantedEditors');
};

global.doGet = doGet;
global.onEditorsHomepage = onEditorsHomepage;
global.onFileScopeGrantedEditors = onFileScopeGrantedEditors;
