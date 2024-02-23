import { sentenceCase } from 'change-case';

export const formatCategories = (categories) => {
  return categories.map((category) => ({
    label: sentenceCase(category?.name || ''),
    value: sentenceCase(category?.name || ''),
  }));
};
