import { map } from 'rxjs/operators';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import * as RecipesActions from '../store/recipes.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  private storeSub: Subscription;
  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        this.id = params['id'] ? +params['id'] : null;
        this.editMode = this.id != null;
        this.initForm();
      });
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(new RecipesActions
        .UpdateRecipe({index: this.id, recipe: this.recipeForm.value}))
    } else {
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value))
    }

    this.router.navigate(['../'], { relativeTo: this.route });

  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  get ingredientControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  onAddIngredient() {
    (this.recipeForm.get('ingredients') as FormArray)
      .push(new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      }))
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private initForm() {

    let recipeName: string = '';
    let imagePath: string = '';
    let description: string = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSub = this.store.select('recipes')
        .pipe(
          map(recipesState => recipesState.recipes
            .find((recipe, index) => index === this.id)
          )
        ).subscribe(recipe => {
          recipeName = recipe.name;
          imagePath = recipe.imagePath;
          description = recipe.description;
          if (recipe['ingredients']) {
            for (let ingredient of recipe.ingredients) {
              recipeIngredients.push(new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [
                  Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
              }))
            }
          }
        })
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(imagePath, Validators.required),
      'description': new FormControl(description, Validators.required),
      'ingredients': recipeIngredients
    });
  }
}
