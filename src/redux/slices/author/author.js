import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  author: null,
  authors: [],
};

export const slice = createSlice({
  name: 'author',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    resetAuthor(state) {
      state.author = null;
    },

    getAuthorsSuccess(state, action) {
      state.isLoading = false;
      state.authors = action.payload;
    },

    // GET AUTHOR
    getAuthorSuccess(state, action) {
      state.isLoading = false;
      state.author = action.payload;
    },

    filterAuthors(state, action) {
      state.filters.type = action.payload.type;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { filterAuthors, startLoading, hasError, resetAuthor, getAuthorSuccess } = slice.actions;
