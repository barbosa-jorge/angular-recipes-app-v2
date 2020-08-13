import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as fromApp from '../store/app.reducer'
import { Store } from '@ngrx/store';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userAuthSubs: Subscription;
  isAuthenticated = false;

  constructor(
    private store: Store<fromApp.AppState>
  ) {
  }

  ngOnInit() {
    this.userAuthSubs = this.store.select('auth')
      .pipe(
        map(authStore => authStore.user)
      )
      .subscribe(user => this.isAuthenticated = !!user);
  }

  ngOnDestroy() {
    this.userAuthSubs.unsubscribe();
  }

  onSaveData() {
    this.store.dispatch(new RecipesActions.StoreRecipes());
  }

  onFetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes())
  }

  onLogout(){
    this.store.dispatch(new AuthActions.Logout());
  }

}
