import { RecipeService } from './../../recipe.service';
import { Recipe } from './../recipe.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent {
  @Input('recipe') recipe: Recipe;
  @Input('index') index: number;
}
