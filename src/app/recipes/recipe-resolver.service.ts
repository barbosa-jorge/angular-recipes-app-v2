import { take, map, switchMap } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import { Recipe } from './recipe-list/recipe.model';
import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipes.actions';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]> {

    constructor(
        private store: Store<fromApp.AppState>,
        private actions$: Actions) {
    }

    /**
     * resolve method expects an observable to be returned, 
     * it only resolveds after the observable is completed.
     * Dispatch does not return an observable, 
     * and because of that it was needed to watch for SET_RECIPES action to be completed.
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        return this.store.select('recipes')
            .pipe(
                take(1),
                map(recipeState => recipeState.recipes),
                switchMap(recipes => {
                    if (recipes.length === 0) {
                        this.store.dispatch(new RecipesActions.FetchRecipes());
                        return this.actions$
                            .pipe(
                                ofType(RecipesActions.SET_RECIPES),
                                take(1)
                            )
                    } else {
                        return of(recipes);
                    }
                })
            )
    }
}