// src/redux/store.js
import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
  compose,
} from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

// Twoje istniejące importy:
import initialState from './initialState';
import listsReducer from './listsRedux';
import columnsReducer from './columnsRedux';
import cardsReducer from './cardsRedux';
import searchStringReducer from './searchStringRedux';

// (jeśli dodałeś wcześniej integrację z PouchDB)
import pouchReducer from './pouchReducer'; // <- jeśli nie używasz, usuń ten import i wpis 'pouch' poniżej

const subreducers = {
  lists: listsReducer,
  columns: columnsReducer,
  cards: cardsReducer,
  searchString: searchStringReducer,

  // jeśli używasz PouchDB reducera:
  pouch: pouchReducer, // <- usuń, jeśli nie używasz
};

const reducer = combineReducers(subreducers);

// DevTools dla Redux 5
const enhancer = composeWithDevTools(
  applyMiddleware(thunk)
);

// Utworzenie store
const store = createStore(
  reducer,
  initialState,
  enhancer
);

export default store;
