// src/redux/searchStringRedux.js
const UPDATE = 'app/searchString/UPDATE';

export const updateSearchstring = ({ searchKey = '' } = {}) => ({
  type: UPDATE,
  payload: { searchKey },
});

const initialState = { searchKey: '' };

export default function searchStringReducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE:
      return { ...state, searchKey: action.payload?.searchKey ?? '' };
    default:
      return state;
  }
}

// (opcjonalnie) selektor
export const selectSearchKey = (state) => state?.searchString?.searchKey || '';
