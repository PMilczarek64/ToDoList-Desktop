import { strContains } from '../utils/strContains';

//selectors
export const getFilteredCards = (state) => {
  const cards = state?.cards ?? [];
  const searchKey = state?.searchString?.searchKey?.toLowerCase?.() ?? '';
  
  return cards.filter(card =>
    card.title?.toLowerCase().includes(searchKey)
  );
};

//action
const createActionName = actionName => `app/filteredCards/${actionName}`;
const UPDATE_SEARCHSTRING = createActionName('UPDATE_SEARCHSTRING');

//action creators
export const updateSearchstring = payload => ({ type: UPDATE_SEARCHSTRING, payload });

const searchStringReducer = (statePart = '', action) => {
  switch(action.type) {
    case UPDATE_SEARCHSTRING:
      return action.payload
    default:
      return statePart;
  };
};

export default searchStringReducer;