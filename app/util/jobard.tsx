import Cookies from 'js-cookie';

export const parseCookie = (cookieName: string) => {
  try {
    return JSON.parse(Cookies.get(cookieName) || '');
  } catch (e) {
    console.error(`Error parsing cookie: ${cookieName}`, e);
    return null;
  }
};

export const clearCookies = () => {
  const cookieNames = [
    'paperData',
    'binderyData',
    'deliveryData',
    'PaperUnitsData',
    'paymentData',
    'plateData',
    'prePressData',
    'costCalculation',
    'pressUnitData',
  ];

  cookieNames.forEach(name => Cookies.remove(name));
};