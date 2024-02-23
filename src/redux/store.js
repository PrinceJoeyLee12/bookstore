import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';
import { createReduxHistoryContext } from 'redux-first-history';
import { persistStore, persistReducer } from 'redux-persist';
import { rootPersistConfig, rootReducer } from './rootReducer';

// ----------------------------------------------------------------------

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
});

const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer({ router: routerReducer })),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(routerMiddleware),
});

const persistor = persistStore(store);

const { dispatch } = store;

const useSelector = useAppSelector;

const useDispatch = () => useAppDispatch();

const history = createReduxHistory(store);

export { store, persistor, history, dispatch, useSelector, useDispatch };
