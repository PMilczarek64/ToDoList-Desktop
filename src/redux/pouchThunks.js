import { ensureIndexes, db } from '../api/db';
import * as repo from '../api/repos';
import { pouchSetAll, pouchUpsertDoc, pouchRemoveDoc } from './pouchReducer';

export const bootstrapPouch = () => async (dispatch) => {
  await ensureIndexes();
  const [lists, categories, cards] = await Promise.all([
    repo.listLists(),
    (await db.find({ selector: { type: 'category' } })).docs,
    (await db.find({ selector: { type: 'card' } })).docs,
  ]);
  dispatch(pouchSetAll({ lists, categories, cards }));

  db.changes({ since: 'now', live: true, include_docs: true })
    .on('change', ({ doc, deleted }) => {
      if (deleted) dispatch(pouchRemoveDoc(doc));
      else dispatch(pouchUpsertDoc(doc));
    });
};

// operacje (wołasz z komponentów przez dispatch)
export const addList        = (p)           => async () => { await repo.createList(p); };
export const editList       = (id, patch)   => async () => { await repo.updateList(id, patch); };
export const removeList     = (id)          => async () => { await repo.deleteList(id); };

export const addCategory    = (p)           => async () => { await repo.createCategory(p); };

export const addCard        = (p)           => async () => { await repo.createCard(p); };
export const editCard       = (id, patch)   => async () => { await repo.updateCard(id, patch); };
export const toggleFavorite = (id)          => async () => { await repo.toggleFavoriteCard(id); };
export const removeCard     = (id)          => async () => { await repo.deleteCard(id); };

export const searchCardsThunk = (query)     => async () => repo.searchCards(query);
