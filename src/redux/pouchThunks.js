import { ensureIndexes, db } from '../api/db';
import * as repo from '../api/repos';
import { pouchSetAll, pouchUpsertDoc, pouchRemoveDoc } from './pouchReducer';

/**
 * 🧩 Inicjalizacja bazy PouchDB – ładuje wszystkie dokumenty i subskrybuje zmiany
 */
export const bootstrapPouch = () => async (dispatch) => {
  await ensureIndexes();

  const [lists, categories, cards] = await Promise.all([
    repo.listLists(),
    (await db.find({ selector: { type: 'category' } })).docs,
    (await db.find({ selector: { type: 'card' } })).docs,
  ]);

  dispatch(pouchSetAll({ lists, categories, cards }));

  // live sync zmian w bazie
  db.changes({ since: 'now', live: true, include_docs: true })
    .on('change', ({ doc, deleted }) => {
      if (deleted) dispatch(pouchRemoveDoc(doc));
      else dispatch(pouchUpsertDoc(doc));
    });
};

/**
 * 🧱 LISTS
 */
export const addList = (payload) => async () => {
  await repo.createList(payload);
};

export const editList = (id, patch) => async () => {
  await repo.updateList(id, patch);
};

export const removeList = (id) => async () => {
  await repo.deleteList(id);
};

/**
 * 🧩 CATEGORIES (czyli kolumny)
 */
export const addCategory = (payload) => async () => {
  // 👇 zapisz także ikonę, jeśli została podana
  const doc = {
    ...payload,
    icon: payload.icon || '',
  };
  await repo.createCategory(doc);
};

export const editCategory = (id, patch) => async () => {
  await repo.editCategory(id, patch);
};

/**
 * 🗂️ CARDS
 */
export const addCard = (p) => async (dispatch) => {
  const doc = await repo.createCard(p);
  console.log('[thunk:addCard] created card:', doc);
  dispatch(pouchUpsertDoc(doc));     // ← od razu do store
};


export const editCard = (id, patch) => async () => {
  await repo.updateCard(id, patch);
};

export const toggleFavorite = (id) => async () => {
  await repo.toggleFavoriteCard(id);
};

export const removeCard = (id) => async () => {
  await repo.deleteCard(id);
};

/**
 * 🔍 WYSZUKIWANIE
 */
export const searchCardsThunk = (query) => async () => {
  return await repo.searchCards(query);
};
