import { API } from 'aws-amplify';
import { listBooksCustom as listBooks } from 'graphql/customQueries';
import { dispatch } from 'redux/store';
import { slice } from './book';
// Actions

export const getBooks = async () => {
  dispatch(slice.actions.startLoading());
  try {
    // 1. Get Books
    const booksRes = await API.graphql({
      query: listBooks,
      variables: { limit: 1000 },
    });

    const books = (booksRes.data.listBooks?.items || []).map((book) => book);

    dispatch(slice.actions.getBooksSuccess(books));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getBook = async (id) => {
  dispatch(slice.actions.startLoading());
  try {
    // 1. Get Books
    const bookRes = await API.graphql({
      query: listBooks,
      variables: { filter: { id: { eq: id } } },
    });

    const book = (bookRes.data.listBooks?.items || []).map((book) => book)?.[0]; // expect only one book

    dispatch(slice.actions.getBookSuccess(book));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export function searchBooks(filterQuery = {}) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      // 1. Get Books
      let filter = null;
      if (Object.keys(filterQuery)?.length) {
        filter = filterQuery;
      }
      const booksResponse = await API.graphql({
        query: listBooks,
        variables: { ...(filter ? { filter } : {}) },
      });

      const books = booksResponse?.data?.listBooks?.items;

      dispatch(slice.actions.getBooksSuccess(books));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
