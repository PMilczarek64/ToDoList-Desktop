// src/redux/pouchReducer.js

// Ten slice trzyma zdenormalizowane dokumenty z PouchDB, żeby UI mógł
// szybko renderować listy/kategorie/karty bez ręcznego odczytu z bazy.
//
// Uwaga: NIE zastępuje Twoich istniejących reducerów (lists/columns/cards).
// To dodatkowa warstwa do integracji offline-first. Możesz stopniowo
// przepinać widoki na selektory z tego reducera.

const INITIAL = {
  lists: [],
  categories: [],
  cards: [],
  loaded: false,
};

export default function pouchReducer(state = INITIAL, action) {
  switch (action.type) {
    case 'pouch/setAll': {
      const { lists, categories, cards } = action.payload;
      return { ...state, lists, categories, cards, loaded: true };
    }
    case 'pouch/upsertDoc': {
      const doc = action.payload;
      const key =
        doc.type === 'list' ? 'lists' :
        doc.type === 'category' ? 'categories' :
        doc.type === 'card' ? 'cards' : null;
      if (!key) return state;

      const map = Object.fromEntries(state[key].map(x => [x._id, x]));
      map[doc._id] = doc;

      return { ...state, [key]: Object.values(map) };
    }
    case 'pouch/removeDoc': {
      const doc = action.payload;
      const key =
        doc.type === 'list' ? 'lists' :
        doc.type === 'category' ? 'categories' :
        doc.type === 'card' ? 'cards' : null;
      if (!key) return state;

      return { ...state, [key]: state[key].filter(d => d._id !== doc._id) };
    }
    default:
      return state;
  }
}

// Action creators (proste, bez RTK)
export const pouchSetAll    = (payload) => ({ type: 'pouch/setAll',    payload });
export const pouchUpsertDoc = (payload) => ({ type: 'pouch/upsertDoc', payload });
export const pouchRemoveDoc = (payload) => ({ type: 'pouch/removeDoc', payload });

// Selectory pomocnicze do UI
export const selectPouchLoaded = (s) => s.pouch?.loaded;
export const selectPouchLists  = (s) => s.pouch?.lists || [];
export const selectPouchCategoriesByList = (listId) => (s) =>
  (s.pouch?.categories || []).filter(c => c.listId === listId);
export const selectPouchCardsByList = (listId) => (s) =>
  (s.pouch?.cards || []).filter(c => c.listId === listId);
