 /* import shortid from "shortid";

//selectors
export const getFavoriteCards = state => state.cards.filter(card => card.isFavorite === true);

//action 
const createActionName = actionName => `app/cards/${actionName}`;
const ADD_CARD = createActionName('ADD_CARD');
const UPDATE_FAVORITE = createActionName('UPDATE_FAVORITE');
const REMOVE_CARD = createActionName('REMOVE_CARD');

// action creators
export const addCard = payload => ({ type: ADD_CARD, payload });
export const updateFavorite = payload => ({ type: UPDATE_FAVORITE, payload });
export const removeCard = payload => ({ type: REMOVE_CARD, payload })

const cardsReducer = (statePart = [], action) => {
  switch(action.type) {
    case ADD_CARD:
      return [...statePart, { ...action.payload, id: shortid() }];
    case UPDATE_FAVORITE:
      return statePart.map(card => (card.id === action.payload) ? { ...card, isFavorite: !card.isFavorite } : card);
    case REMOVE_CARD:
      return statePart.filter(card => card.id !== action.payload);
    default:
      return statePart;
  };
};

export default cardsReducer;

*/