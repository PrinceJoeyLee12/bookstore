import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/user/user';
import alertReducer from './slices/alert/alert';
import authorReducer from './slices/author/author';
import bookReducer from './slices/book/book';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'bookstore-redux-',
  blacklist: ['user', 'book', 'author'],
};

const rootReducer = (otherReducers = {}) =>
  combineReducers({
    ...otherReducers,
    user: userReducer,
    author: authorReducer,
    book: bookReducer,
    alert: alertReducer,
  });

export { rootPersistConfig, rootReducer };
