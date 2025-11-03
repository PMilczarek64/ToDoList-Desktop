// src/redux/pouchThunks.js
import { ensureIndexes, db } from '../api/db';
import * as repo from '../api/repos';
import { pouchSetAll, pouchUpsertDoc, pouchRemoveDoc } from './pouchReducer';

// 1) Start: indeksy + wczytanie danych + live feed zmian z PouchDB -> Redux
export const bootstrapPouch = () => async (dispatch) => {
  await ensureIndexes();

  const [lists, categories, cards] = await Promise.all([
    repo.listLists(),
    (await db.find({ selector: { type: 'category' } })).docs,
    (await db.find({ selector: { type: 'card' } })).docs,
  ]);

  dispatch(pouchSetAll({ lists, categories, cards }));

  // live aktualizacje (insert/update/delete) z PouchDB
  db.changes({ since: 'now', live: true, include_docs: true })
    .on('change', ({ doc, deleted }) => {
      if (deleted) dispatch(pouchRemoveDoc(doc));
      else dispatch(pouchUpsertDoc(doc));
    });
};

// 2) Operacje LISTS (wywołuj z komponentów przez dispatch)
export const addList    = (payload)       => async () => { await repo.createList(payload); };
export const editList   = (id, patch)     => async () => { await repo.updateList(id, patch); };
export const removeList = (id)            => async () => { await repo.deleteList(id); };

// 3) Operacje CATEGORIES
export const addCategory = (payload)      => async () => { await repo.createCategory(payload); };

// 4) Operacje CARDS
export const addCard        = (payload)   => async () => { await repo.createCard(payload); };
export const editCard       = (id, patch) => async () => { await repo.updateCard(id, patch); };
export const toggleFavorite = (id)        => async () => { await repo.toggleFavoriteCard(id); };
export const removeCard     = (id)        => async () => { await repo.deleteCard(id); };

// 5) Wyszukiwanie – wynik odbierz w komponencie (setState)
export const searchCardsThunk = (query)   => async () => repo.searchCards(query);
