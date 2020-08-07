import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { AuthComponent } from './auth.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * I'am using load lazying, that is why path is ''
 */

const routes: Routes = [{ path: '', component: AuthComponent }];

@NgModule({
  declarations: [ AuthComponent ],
  imports: [ 
    FormsModule, 
    CommonModule, 
    SharedModule, 
    RouterModule.forChild(routes) 
  ]
})
export class AuthModule {

}