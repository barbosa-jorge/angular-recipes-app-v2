import { SharedModule } from './../shared/shared.module';
import { ShoppingListRouting } from './shopping-list-routing.module';
import { RouterModule } from '@angular/router';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    RouterModule,  
    FormsModule,
    ShoppingListRouting,
    SharedModule
  ]
})
export class ShoppingListModule {
}