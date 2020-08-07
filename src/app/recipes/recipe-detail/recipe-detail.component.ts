import { RecipeService } from './../recipe.service';
import { ShoppingListService } from './../../shopping-list/shopping-list.service';
import { Recipe } from './../recipe-list/recipe.model';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private shoppingListService : ShoppingListService, 
    private route: ActivatedRoute, 
    private router: Router,
    private recipeService: RecipeService) {
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.id = +params['id'];  
        this.recipe = this.recipeService.getRecipeByIndex(this.id);     
    });
  }
  
  onDelete() {
    this.recipeService.deleteRecipe(this.id)
    this.router.navigate(['/recipes'])
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route} )
    // this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route} )
  }

  onAddToShoppingList() {
    this.shoppingListService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

}
