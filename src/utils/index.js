export * from './localStorage';
export * from './common';

export const emptyObject = Object.freeze({});

/**
 * Get object without particular keys
 */
export const omitProps = (object, propNames) => {
  return Object.keys(object).reduce((acc, key) => {
    if (propNames.includes(key)) return acc;
    acc[key] = object[key];
    return acc;
  }, {});
};

/**
 * Get object without all keys except particular list
 */
export const pickProps = (object, propNames) => {
  return propNames.reduce((acc, key) => {
    acc[key] = object[key];
    return acc;
  }, {});
};
