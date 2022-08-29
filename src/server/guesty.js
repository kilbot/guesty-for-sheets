import { makeHttpGetRequest } from './http';

/**
 *
 */
export const fetchReservation = (sheet, reservationCode) => {
  const result = makeHttpGetRequest(
    `https://api.guestyforhosts.com/external/v1/reservation/byCode/${reservationCode}`,
    {}
  );
  const reservation = result[0];

  sheet.appendRow([
    reservationCode, // 'Reservation',
    reservation.guestName, // 'First Name',
    reservation.guestSurname, // 'Last Name',
    reservation.checkInDate, // 'Check-in',
    reservation.checkOutDate, // 'Check-out',
    reservation.priceDetail.hostPayoutAmountMicros, // 'Pay Out',
    reservation.priceDetail.priceItems[0].totalAmountMicros, // 'Accommodation',
    reservation.priceDetail.priceItems[1].totalAmountMicros, // 'Cleaning',
    reservation.priceDetail.priceItems[2].totalAmountMicros, // 'Service Fee',
  ]);
};

/**
 *
 */
export const fetchReservations = (sheet, propertyId, startDate, endDate) => {
  const reservations = makeHttpGetRequest(
    `https://api.guestyforhosts.com/external/v1/reservation/listFor/${propertyId}/${startDate}/${endDate}`,
    {}
  );

  const reservationCodes = reservations.map((reservation) => reservation.reservationCode);
  reservationCodes.forEach((reservationCode) => {
    fetchReservation(sheet, reservationCode);
  });
};

/**
 *
 */
export const fetchProperties = () => {
  const properties = makeHttpGetRequest('https://api.guestyforhosts.com/external/v1/listings/getAll', {});

  // const sheetNames = properties.maps((property) => property.nickname);
  // const existingSheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  // const existingSheetNames = existingSheets.map((sheet) => sheet.getName());
  // Logger.log(existingSheetNames);

  // This code uses the Sheets Advanced Service, but for most use cases
  // the built-in method SpreadsheetApp.create() is more appropriate.
  properties.forEach((property) => {
    let sheet = null;
    try {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(property.nickname);
      if (sheet === null) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(property.nickname);
      }

      // remove this
      sheet.clear();

      sheet.getRange('A1').setValue(property.name);
      sheet.addDeveloperMetadata('propertyId', property.id);

      // todays date
      const today = new Date();
      const startDate = Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd');
      const endDate = Utilities.formatDate(new Date(today.setMonth(today.getMonth() + 1)), 'GMT', 'yyyy-MM-dd');

      sheet
        .getRange('A2:D2')
        .setValues([['From', startDate, 'To', endDate]])
        .setFontWeights([['bold', 'normal', 'bold', 'normal']]);

      sheet
        .getRange('A4:I4')
        .setValues([
          [
            'Reservation',
            'First Name',
            'Last Name',
            'Check-in',
            'Check-out',
            'Pay Out',
            'Accommodation',
            'Cleaning',
            'Service Fee',
          ],
        ])
        .setFontWeight('bold');

      sheet.setFrozenRows(4);

      fetchReservations(sheet, property.id, startDate, endDate);
      return sheet;
    } catch (err) {
      // TODO (developer) - Handle exception
      return Logger.log('Failed with error %s', err.message);
    }
  });
};

global.fetchProperties = fetchProperties;
