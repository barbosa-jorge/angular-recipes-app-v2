import { Store } from '@ngrx/store';
import { Ingredient } from './../shared/ingredient.model';
import { Subject } from 'rxjs';
import { Recipe } from './recipe-list/recipe.model';
import { Injectable } from '@angular/core';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();
    private recipes: Recipe[] = [];
    
    constructor(
      private store: Store<fromApp.AppState>
      ) {
    }

    getRecipes() {
      return this.recipes.slice();
    }

    setRecipes(recipes: Recipe[]) {
      this.recipes = recipes;
      this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
      this.recipes.splice(index, 1);
      this.recipesChanged.next(this.recipes.slice());
    }

    getRecipeByIndex(index: number) {
      return this.recipes[index];
    }

    updateRecipe(index: number, recipe: Recipe) {
      this.recipes[index] = recipe;
      this.recipesChanged.next(this.recipes.slice());
    }

    addRecipe(recipe: Recipe) {
      this.recipes.push(recipe);
      this.recipesChanged.next(this.recipes.slice());
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
     // this.shoppingListService.addIngredientsToShoppingList(ingredients);
      this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }
}