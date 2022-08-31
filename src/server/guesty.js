import { makeHttpGetRequest } from './http';

/**
 *
 */
const fetchReservation = (sheet, reservation) => {
  const result = makeHttpGetRequest(
    `https://api.guestyforhosts.com/external/v1/reservation/byCode/${reservation.reservationCode}`,
    {}
  );
  const detail = result[0];
  Logger.log(detail);
  const phone = `'${detail.phoneNumber}`;
  const payout = detail.priceDetail ? detail.priceDetail.hostPayoutAmountMicros / 1000000 : 0;
  const lastRow = sheet.getLastRow();

  // append row
  sheet.appendRow([
    detail.reservationId, // 'Reservation Id',
    detail.roomId, // 'Room Id',
    detail.sourceId, // 'Source Id',
    reservation.startDate, // 'Check-in',
    reservation.endDate, // 'Check-out',
    detail.guestName, // 'First Name',
    detail.guestSurname, // 'Last Name',
    phone, // 'Phone Number',
    detail.nights, // 'Nights',
    detail.note, // 'Note',
    detail.numOfAdults, // 'Adults',
    detail.numOfKids, // 'Kids',
    detail.numOfInfants, // 'Infants',
    payout, // 'Pay Out',
  ]);

  const newRow = lastRow + 1;
  // format payout as currency
  // const currencySymbol = detail.currency === 'GBP' ? '£' : '$';
  const format = '#,##0.00';
  sheet.getRange(`N${newRow}`).setNumberFormat(format);
};

/**
 *
 */
const fetchReservations = (sheet, propertyId, startDate, endDate) => {
  const reservations = makeHttpGetRequest(
    `https://api.guestyforhosts.com/external/v1/reservation/listFor/${propertyId}/${startDate}/${endDate}`,
    {}
  );

  // clear all rows below the frozen line
  const lastRow = sheet.getLastRow();
  if (lastRow > 4) {
    sheet.getRange(`5:${lastRow}`).clear();
  }

  reservations.forEach((reservation) => {
    fetchReservation(sheet, reservation);
  });
};

/**
 *
 */
export const fetchProperties = () => {
  const properties = makeHttpGetRequest('https://api.guestyforhosts.com/external/v1/listings/getAll', {});

  // const sheetNames = properties.maps((property) => property.nickname);
  const propertySheetMap = new Map();
  const existingSheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  if (existingSheets > 1) {
    existingSheets.forEach((sheet) => {
      const metaData = sheet.getDeveloperMetadata();
      if (metaData.length > 0) {
        metaData.forEach((meta) => {
          if (meta.getKey() === 'propertyId') {
            propertySheetMap.set(meta.getValue(), sheet);
          }
        });
      }
    });
  }

  // const existingSheetNames = existingSheets.map((sheet) => sheet.getName());
  // Logger.log(existingSheetNames);

  // This code uses the Sheets Advanced Service, but for most use cases
  // the built-in method SpreadsheetApp.create() is more appropriate.
  properties.forEach((property) => {
    let sheet;
    try {
      sheet = propertySheetMap.get(property.id);
      if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(property.nickname);
        sheet.addDeveloperMetadata('propertyId', property.id);
      }

      // clear all data from property sheet
      sheet.clear();

      sheet.getRange('A1').setValue(property.name);

      // todays date
      // const today = new Date();
      // const startDate = Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd');
      // const endDate = Utilities.formatDate(new Date(today.setMonth(today.getMonth() + 1)), 'GMT', 'yyyy-MM-dd');

      const startDate = '2022-07-01';
      const endDate = '2032-12-31';

      // sheet
      //   .getRange('A2:D2')
      //   .setValues([['From', startDate, 'To', endDate]])
      //   .setFontWeights([['bold', 'normal', 'bold', 'normal']]);

      sheet
        .getRange('A4:N4')
        .setValues([
          [
            'Reservation Id',
            'Room Id',
            'Source Id',
            'Check-in',
            'Check-out',
            'First Name',
            'Last Name',
            'Phone Number',
            'Nights',
            'Note',
            'Adults',
            'Kids',
            'Infants',
            'Pay Out',
          ],
        ])
        .setFontWeight('bold');

      sheet.setFrozenRows(4);

      fetchReservations(sheet, property.id, startDate, endDate);
      return sheet;
    } catch (err) {
      return Logger.log('Failed with error %s', err.message);
    }
  });
};

/**
 *
 */
export const triggerGetReservations = () => {
  try {
    const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    if (sheets.length > 1) {
      sheets.forEach((sheet) => {
        const metaData = sheet.getDeveloperMetadata();
        if (metaData.length > 0) {
          metaData.forEach((meta) => {
            if (meta.getKey() === 'propertyId') {
              const propertyId = meta.getValue();
              // const startDate = Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd');
              const startDate = '2022-07-01';
              const endDate = '2032-12-31';
              try {
                fetchReservations(sheet, propertyId, startDate, endDate);
              } catch (err) {
                Logger.log('Failed with error %s', err.message);
              }
            }
          });
        }
      });
    }
  } catch (err) {
    Logger.log('Failed with error %s', err.message);
  }
};

global.fetchProperties = fetchProperties;
global.triggerGetReservations = triggerGetReservations;
