// src/hooks/pouchHooks.js
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';

import {
  selectPouchLists,
  selectPouchCategoriesByList,
  selectPouchCardsByList,
} from '../redux/pouchReducer';

import {
  addList, removeList, editList,
  addCategory,        // create column
  editCategory,       // update column
  addCard, editCard, toggleFavorite, removeCard,
  searchCardsThunk,
} from '../redux/pouchThunks';

/* =====================================================================================
 *  READ HOOKS
 * ===================================================================================== */

// ====== LISTS ======
export function usePouchLists() {
  const lists = useSelector(selectPouchLists);
  console.log('%c[usePouchLists] raw lists from Redux:', 'color:cyan', lists);

  const sorted = useMemo(() => {
    const arr = [...lists].sort(
      (a, b) => b.updatedAt?.localeCompare(a.updatedAt || '') || 0
    );
    console.log('%c[usePouchLists] sorted lists returned:', 'color:cyan', arr);
    return arr;
  }, [lists]);

  return sorted;
}

// ====== COLUMNS (CATEGORIES) ======
export function usePouchColumns(listId) {
  const selectColumnsForList = useMemo(
    () => selectPouchCategoriesByList(listId),
    [listId]
  );
  const columns = useSelector(selectColumnsForList);

  const sorted = useMemo(() => {
    const arr = [...columns].sort(
      (a, b) => a.createdAt?.localeCompare(b.createdAt || '') || 0
    );
    console.log('%c[usePouchColumns] for list:', 'color:orange', listId, arr);
    return arr;
  }, [columns, listId]);

  return sorted;
}

// ====== CARDS ======
export function usePouchCards({ listId, categoryId = null, q = '', favoritesOnly = false }) {
  const selectCardsForList = useMemo(
    () => selectPouchCardsByList(listId),
    [listId]
  );
  const cardsAll = useSelector(selectCardsForList);

  const filtered = useMemo(() => {
    let out = [...cardsAll];
    if (categoryId) out = out.filter(c => c.categoryId === categoryId);
    if (favoritesOnly) out = out.filter(c => !!c.isFavorite);
    if (q) {
      const s = q.toLowerCase();
      out = out.filter(c =>
        (c.title || '').toLowerCase().includes(s) ||
        (c.description || '').toLowerCase().includes(s)
      );
    }
    const sorted = out.sort(
      (a, b) => b.updatedAt?.localeCompare(a.updatedAt || '') || 0
    );

    console.log(
      '%c[usePouchCards]',
      'color:violet',
      { listId, categoryId, total: cardsAll.length, filtered: sorted.length }
    );

    return sorted;
  }, [cardsAll, categoryId, q, favoritesOnly]);

  return filtered;
}

// ====== SEARCH ======
export function usePouchSearch({ listId, q = '', favoritesOnly = false, tags = [] }) {
  const dispatch = useDispatch();
  const [results, setResults] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await dispatch(searchCardsThunk({ listId, q, favoritesOnly, tags }));
      const data = res?.payload ?? res;
      if (alive) setResults(Array.isArray(data) ? data : []);
    })();
    return () => { alive = false; };
  }, [dispatch, listId, q, favoritesOnly, JSON.stringify(tags)]);

  return results;
}

/* =====================================================================================
 *  WRITE HOOKS (ACTIONS)
 * ===================================================================================== */

export function usePouchActions() {
  const dispatch = useDispatch();

  // ====== LISTS ======
  const createList = (payload) => dispatch(addList(payload));
  const updateList = (id, patch) => dispatch(editList(id, patch));
  const destroyList = (id) => dispatch(removeList(id));

  // ====== COLUMNS ======
  const createColumn = (payload) => dispatch(addCategory(payload));      // create
  const updateColumn = (id, patch) => dispatch(editCategory(id, patch)); // update
  const createCategory = (payload) => dispatch(addCategory(payload));    // alias

  // ====== CARDS ======
  // w usePouchActions()
const createCard = (payload) => {
  if (!payload?.listId) {
    console.error('[createCard] Missing listId in payload:', payload);
    return;
  }
  if (!payload?.categoryId) {
    console.error('[createCard] Missing categoryId in payload:', payload);
    return;
  }
  console.log('%c[usePouchActions.createCard] payload:', 'color:lime', payload);
  return dispatch(addCard(payload));
};


  const updateCard = (id, patch) => dispatch(editCard(id, patch));
  const toggleCardFavorite = (id) => dispatch(toggleFavorite(id));
  const destroyCard = (id) => dispatch(removeCard(id));

  return {
    // lists
    createList, updateList, destroyList,
    // columns
    createColumn, updateColumn, createCategory,
    // cards
    createCard, updateCard, toggleCardFavorite, destroyCard,
  };
}
