import { RecipeResolverService } from './recipe-resolver.service';
import { AuthGuard } from './../auth/auth.guard';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './../recipe-edit/recipe-edit.component';
import { RecipesComponent } from './recipes.component';
import { RecipeStartComponent } from './../recipe-start/recipe-start.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { 
    path: '', 
    component: RecipesComponent, 
    canActivate: [AuthGuard], 
    children: [
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent },
      { path: ':id', component: RecipeDetailComponent, resolve: [RecipeResolverService] },
      { path: ':id/edit', component: RecipeEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {

}