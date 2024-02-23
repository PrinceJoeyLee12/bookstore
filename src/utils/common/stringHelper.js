export const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const capitalizerOfWords = (words) =>
  words
    .split(' ')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');

export const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

export const insert = (str, index, value) => {
  return str.substr(0, index) + value + str.substr(index);
};

export const encodePHPhoneNumber = (phoneNumber = '') => insert(phoneNumber.slice(2), 0, '+639');

export const decodePHPhoneNumber = (phoneNumber = '') => insert(phoneNumber.slice(3), 0, '0');
