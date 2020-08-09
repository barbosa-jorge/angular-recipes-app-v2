import { AuthService } from './../auth/auth.service';
import { Recipe } from './../recipes/recipe-list/recipe.model';
import { RecipeService } from './../recipes/recipe.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DataStoreService {

    recipesUrl = 'https://ng-recipes-f1188.firebaseio.com/recipes.json';

    constructor(
        private http: HttpClient, 
        private recipeService: RecipeService) {
    }

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put(this.recipesUrl, recipes)
        .subscribe(response => {
            console.log(response);
        })
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>(this.recipesUrl).pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    return { 
                        ... recipe, 
                        ingredients: recipe.ingredients ? recipe.ingredients : [] }
                });
            }),
            tap(recipes => {
                this.recipeService.setRecipes(recipes);      
            })
        );
    }
}