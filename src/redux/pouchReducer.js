const INITIAL = { lists: [], categories: [], cards: [], loaded: false };

export default function pouchReducer(state = INITIAL, action) {
  switch (action.type) {
    case 'pouch/setAll': {
      const { lists, categories, cards } = action.payload;
      return { ...state, lists, categories, cards, loaded: true };
    }
    case 'pouch/upsertDoc': {
      const doc = action.payload;
      if (doc.type === 'card') {
        const next = state.cards.filter(c => c._id !== doc._id).concat(doc);
        return { ...state, cards: next };
      }
      if (doc.type === 'category') {
        const next = state.categories.filter(c => c._id !== doc._id).concat(doc);
        return { ...state, categories: next };
      }
      if (doc.type === 'list') {
        const next = state.lists.filter(c => c._id !== doc._id).concat(doc);
        return { ...state, lists: next };
      }
      return state;
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

export const pouchSetAll = (payload) => ({ type: 'pouch/setAll', payload });
export const pouchUpsertDoc = (payload) => ({ type: 'pouch/upsertDoc', payload });
export const pouchRemoveDoc = (payload) => ({ type: 'pouch/removeDoc', payload });

export const selectPouchLoaded = s => s.pouch?.loaded;
export const selectPouchLists = s => s.pouch?.lists || [];
export const selectPouchCategoriesByList = (listId) => (s) =>
  (s.pouch?.categories || []).filter(c => c.listId === listId);
export const selectPouchCardsByList = (listId) => (s) =>
  (s.pouch?.cards || []).filter(c => c.listId === listId);
