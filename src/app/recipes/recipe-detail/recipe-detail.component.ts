import { ShoppingListAcionsType } from './../../shopping-list/store/shopping-list.actions';
import { DeleteRecipe } from './../store/recipes.actions';
import { map, switchMap } from 'rxjs/operators';
import { Recipe } from './../recipe-list/recipe.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import * as RecipesActions from '../store/recipes.actions';
import * as ShoppingListAcions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => +params['id']),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes')
        }),
        map(recipesState => {
          return recipesState.recipes.find((recipe, index) => {
            return index === this.id;
          })
        }))
      .subscribe(recipe => this.recipe = recipe)
  }

  onDelete() {
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id))
    this.router.navigate(['/recipes'])
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route })
  }

  onAddToShoppingList() {
    this.store.dispatch(new ShoppingListAcions.AddIngredients(this.recipe.ingredients));
  }

}
