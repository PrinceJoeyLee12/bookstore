import { createSlice } from '@reduxjs/toolkit';
import { BookType } from 'constants/index';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  books: [],
  book: {
    type: '',
    title: '',
    id: '',
    image: '',
    author: {
      firstName: '',
      lastName: '',
      name: '',
      id: '',
    },
  },
  sortBy: null,
  types: Object.values(BookType).map((value) => ({ name: value })) || [],
  filters: {
    type: 'All',
  },
};

export const slice = createSlice({
  name: 'book',
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

    resetBook(state) {
      state.book = null;
    },

    getBooksSuccess(state, action) {
      state.isLoading = false;
      state.books = action.payload;
    },

    // GET BOOK
    getBookSuccess(state, action) {
      state.isLoading = false;
      state.book = action.payload;
    },

    filterBooks(state, action) {
      state.filters.type = action.payload.type;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { startLoading, filterBooks, getBookSuccess, getBooksSuccess, resetBook, hasError } = slice.actions;
