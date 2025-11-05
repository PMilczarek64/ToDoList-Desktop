// src/redux/store.js
import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

import initialState from './initialState';
import listsReducer from './listsRedux';
import columnsReducer from './columnsRedux';
import searchStringReducer from './searchStringRedux';
import pouchReducer from './pouchReducer';

const reducer = combineReducers({

  // nowe, offline-first
  pouch: pouchReducer,
});

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
