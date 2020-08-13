import { Recipe } from './../recipe-list/recipe.model';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { Actions, ofType, Effect } from '@ngrx/effects';

import * as RecipesActions from './recipes.actions';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipeEffects {

  private recipesUrl = 'https://ng-recipes-f1188.firebaseio.com/recipes.json';

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>) {
  }

  @Effect()
  fetchRecipes = this.actions$
    .pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => this.http.get<Recipe[]>(this.recipesUrl)),
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          }
        });
      }),
      map(recipes => new RecipesActions.SetRecipes(recipes))
    )

  @Effect({dispatch: false})  
  storeRecipes = this.actions$
  .pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')), //Allows to merge a value from another observable into this observable
    switchMap(([actionData, recipesState]) => {
      return this.http.put(this.recipesUrl, recipesState.recipes)
    }) 
  )  

}