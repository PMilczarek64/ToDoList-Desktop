// src/hooks/pouchHooks.js
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPouchLists,
  selectPouchCategoriesByList,
  selectPouchCardsByList,
} from '../redux/pouchReducer';
import {
  addList, removeList, editList,
  addCategory,
  addCard, editCard, toggleFavorite, removeCard,
  searchCardsThunk,
} from '../redux/pouchThunks';
import { useEffect, useMemo, useState } from 'react';

// ====== READ ======
export function usePouchLists() {
  const lists = useSelector(selectPouchLists);

  console.log('%c[usePouchLists] raw lists from Redux:', 'color:cyan', lists);

  const sorted = useMemo(() => {
    const arr = [...lists].sort((a, b) => b.updatedAt?.localeCompare(a.updatedAt || '') || 0);
    console.log('%c[usePouchLists] sorted lists returned:', 'color:cyan', arr);
    return arr;
  }, [lists]);

  return sorted;
}

export function usePouchCategories(listId) {
  const cats = useSelector(selectPouchCategoriesByList(listId));
  return useMemo(() => [...cats], [cats]);
}

export function usePouchCards({ listId, categoryId = null, q = '', favoritesOnly = false }) {
  // bazowo czytamy wszystkie karty z listy, a prosty filtr robimy w pamięci
  const cardsAll = useSelector(selectPouchCardsByList(listId));
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
    return out.sort((a, b) => b.updatedAt?.localeCompare(a.updatedAt || '') || 0);
  }, [cardsAll, categoryId, q, favoritesOnly]);
  return filtered;
}

// wersja „z bazy” (gdy chcesz większą precyzję, np. tagi): woła zapytanie do PouchDB
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

// ====== WRITE (akcje) ======
export function usePouchActions() {
  const dispatch = useDispatch();

  // lists
  const createList = (payload) => dispatch(addList(payload));
  const updateList = (id, patch) => dispatch(editList(id, patch));
  const destroyList = (id) => dispatch(removeList(id));

  // categories
  const createCategory = (payload) => dispatch(addCategory(payload));

  // cards
  const createCard = (payload) => dispatch(addCard(payload));
  const updateCard = (id, patch) => dispatch(editCard(id, patch));
  const toggleCardFavorite = (id) => dispatch(toggleFavorite(id));
  const destroyCard = (id) => dispatch(removeCard(id));

  return {
    createList, updateList, destroyList,
    createCategory,
    createCard, updateCard, toggleCardFavorite, destroyCard,
  };
}
