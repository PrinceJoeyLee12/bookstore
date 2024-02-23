import { pickProps, omitProps, emptyObject } from 'utils/index';

export const LOCAL_STORAGE = {
  SPECTRUM_RUNNERS: 'bookstore',
  SPECTRUM_RUNNERS_IMAGES: 'bookstore_IMAGES',
};

/**
 * Get a set of props from localStorage
 */
export const getLocalStorageItem = (name, storeKey = LOCAL_STORAGE.SPECTRUM_RUNNERS) => {
  if (!window.localStorage) return null;
  const localConfigStr = window.localStorage.getItem(storeKey);
  if (!localConfigStr) return null;
  const localConfig = JSON.parse(localConfigStr);
  if (Array.isArray(name)) return pickProps(localConfig, name);
  return localConfig[name] || null;
};

/**
 * Save a set of props to localStorage
 */
export const setLocalStorageItem = (valueMap, storeKey = LOCAL_STORAGE.SPECTRUM_RUNNERS) => {
  if (!window.localStorage) return;
  const localConfigStr = window.localStorage.getItem(storeKey);
  const localConfig = localConfigStr ? JSON.parse(localConfigStr) : emptyObject;
  const nextLocalConfig = {
    ...localConfig,
    ...valueMap,
  };
  window.localStorage.setItem(storeKey, JSON.stringify(nextLocalConfig));
};

/**
 * Remove a set of props from localStorage
 */
export const removeLocalStorageItem = (name, storeKey = LOCAL_STORAGE.SPECTRUM_RUNNERS) => {
  if (!window.localStorage) return;
  const names = Array.isArray(name) ? name : [name];
  const localConfigStr = window.localStorage.getItem(storeKey);
  if (!localConfigStr) return;
  const localConfig = JSON.parse(localConfigStr);
  const nextConfig = omitProps(localConfig, names);
  if (Object.keys(nextConfig).length) {
    const nextLocalConfigStr = JSON.stringify(nextConfig);
    window.localStorage.setItem(storeKey, nextLocalConfigStr);
  } else {
    window.localStorage.removeItem(storeKey);
  }
};

/**
 * Clear localStorage
 */
export const clearLocalStorage = (storeKey = LOCAL_STORAGE.SPECTRUM_RUNNERS) => {
  if (!window.localStorage) return;
  window.localStorage.removeItem(storeKey);
};
