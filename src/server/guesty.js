import { makeHttpGetRequest } from './http';

export const fetchProperties = () => {
  const properties = makeHttpGetRequest('https://api.guestyforhosts.com/external/v1/listings/getAll', {}, '');

  // const sheetNames = properties.maps((property) => property.nickname);
  // const existingSheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  // const existingSheetNames = existingSheets.map((sheet) => sheet.getName());
  // Logger.log(existingSheetNames);

  // This code uses the Sheets Advanced Service, but for most use cases
  // the built-in method SpreadsheetApp.create() is more appropriate.
  properties.map((property) => {
    let sheet = null;
    try {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(property.nickname);
      if (sheet === null) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(property.nickname);
      }
      sheet.getRange('A1').setValue(property.name);
      return sheet;
    } catch (err) {
      // TODO (developer) - Handle exception
      return Logger.log('Failed with error %s', err.message);
    }
  });
};

global.fetchProperties = fetchProperties;
