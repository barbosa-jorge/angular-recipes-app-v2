import { ShoppingListComponent } from './shopping-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

/**
 * I'am using load lazying, that is why path is ''
 */

const routes: Routes = [
  { path: '', component: ShoppingListComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingListRouting {

}