import { RecipeService } from './recipe.service';
import { DataStoreService } from './../shared/data-storage.service';
import { Recipe } from './recipe-list/recipe.model';
import { Injectable } from '@angular/core';
import { 
    Resolve, 
    ActivatedRouteSnapshot, 
    RouterStateSnapshot 
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]> {

    constructor(
        private dataStoreService : DataStoreService, 
        private recipeService : RecipeService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const recipes = this.recipeService.getRecipes();
        if (recipes.length == 0) {
            return this.dataStoreService.fetchRecipes(); 
        } else {
            return recipes;
        }
    }
}