import FetchUtils from '@aem-screens/screens-offlineresources-generator/src/utils/fetchUtils.js';

const getFranklinMarkup = async (host, path) => {
  const resp = await FetchUtils.fetchDataWithMethod(host, path, 'GET');
  return resp.text();
};

export {
  // eslint-disable-next-line import/prefer-default-export
  getFranklinMarkup,
};
