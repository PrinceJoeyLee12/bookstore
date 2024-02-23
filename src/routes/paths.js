// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOT_AUTH = '/auth';
const ROOT_ROUTE = '/route';
const ROOT_USER = '/user';
const ROOT_BOOKS = '/books';
const ROOT_AUTHORS = '/authors';

// AUTH Implement here

export const PATH_AUTH = {
  root: ROOT_AUTH,
  login: path(ROOT_AUTH, '/login'),
  register: path(ROOT_AUTH, '/register'),
  loginUnprotected: path(ROOT_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOT_AUTH, '/register-unprotected'),
  verify: path(ROOT_AUTH, '/verify'),
  resetPassword: path(ROOT_AUTH, '/reset-password'),
  newPassword: path(ROOT_AUTH, '/new-password'),
};

export const PATH = {
  root: ROOT_BOOKS,
  permissionDenied: path(ROOT_ROUTE, '/permission-denied'),
  // User Routes can be modified here
  user: {
    root: path(ROOT_USER, '/user'),
    new: path(ROOT_USER, '/user/new'),
    list: path(ROOT_USER, '/user/list'),
    cards: path(ROOT_USER, '/user/cards'),
    profile: path(ROOT_USER, '/user/profile'),
    account: path(ROOT_USER, '/user/account'),
    edit: (name) => path(ROOT_USER, `/user/${name}/edit`),
  },
  books: {
    root: path(ROOT_BOOKS, '/'),
    list: path(ROOT_BOOKS, '/list'),
    view: (title, id) => path(ROOT_BOOKS, `/${title}/${id}`),
  },
  authors: {
    root: path(ROOT_AUTHORS, '/'),
    list: path(ROOT_AUTHORS, '/list'),
    view: (name, authorId) => path(ROOT_AUTHORS, `/${name}/${authorId}`),
  },
};
