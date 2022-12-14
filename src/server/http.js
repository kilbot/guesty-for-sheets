export const makeQueryString = (url, params = {}) => {
  const paramString = Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + paramString;
};

export const makeHttpGetRequest = (apiUrl, params) => {
  const accessToken = '';

  const url = makeQueryString(apiUrl, params);
  const response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: `Basic ${accessToken}`,
    },
    muteHttpExceptions: true,
  });
  return JSON.parse(response);
};
