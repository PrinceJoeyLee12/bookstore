import { API } from 'aws-amplify';
import { listAuthorsCustom as listAuthors } from 'graphql/customQueries';
import { updateAuthor as updateAuthorMutation } from 'graphql/mutations';
import { dispatch } from 'redux/store';
import { slice } from './author';
// Actions

export const getAuthors = async () => {
  dispatch(slice.actions.startLoading());
  try {
    // 1. Get Authors
    const authorsRes = await API.graphql({
      query: listAuthors,
      variables: { limit: 1000 },
    });

    const authors = (authorsRes.data.listAuthors?.items || []).map((author) => author);

    dispatch(slice.actions.getAuthorsSuccess(authors));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const getAuthor = async (id) => {
  dispatch(slice.actions.startLoading());
  try {
    // 1. Get Authors
    const authorRes = await API.graphql({
      query: listAuthors,
      variables: { filter: { id: { eq: id } } },
    });

    const author = (authorRes.data.listAuthors?.items || []).map((author) => author)?.[0]; // expect only one author

    dispatch(slice.actions.getAuthorSuccess(author));
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export const updateAuthor = async (values) => {
  try {
    // 1. Get Authors
    await API.graphql({
      query: updateAuthorMutation,
      variables: { input: values },
    });
    return { success: true };
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
};

export function searchAuthors(filterQuery = {}) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      // 1. Get Authors
      let filter = null;
      if (Object.keys(filterQuery)?.length) {
        filter = filterQuery;
      }
      const authorsResponse = await API.graphql({
        query: listAuthors,
        variables: { ...(filter ? { filter } : {}) },
      });

      const authors = authorsResponse?.data?.listAuthors?.items;

      dispatch(slice.actions.getAuthorsSuccess(authors));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
