import { Ingredient } from './../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[],
  editedIngredient: Ingredient,
  editedIngredientIndex: number
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 3),
    new Ingredient('Tomatoes', 5)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
}

export function shoppingListReducer(state = initialState, 
  action: ShoppingListActions.ShoppingListAcionsType) {

  switch(action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      }
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [ ...state.ingredients, ...action.payload ]
      }  
    case ShoppingListActions.UPDATE_INGREDIENT:

      const updatedIngredient = {
        ...state.ingredients[state.editedIngredientIndex],
        ...action.payload
      } 

      const updatedIngredients = [ ...state.ingredients ]
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return {
        ...state, 
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngredientIndex: -1
      }

    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients
          .filter((ingredient, index) => index !== state.editedIngredientIndex),
        editedIngredient: null,
        editedIngredientIndex: -1  
      }    
    case ShoppingListActions.START_EDIT: 
      return {
        ...state,
        editedIngredient: { ...state.ingredients[action.payload] },
        editedIngredientIndex: action.payload
      }
    case ShoppingListActions.STOP_EDIT: 
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      }     
    default:
      return state;  
  }
}