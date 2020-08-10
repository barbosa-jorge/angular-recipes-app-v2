import { map } from 'rxjs/operators';
import { AppState } from './../store/app.reducer';
import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { DataStoreService } from './../shared/data-storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as fromApp from '../store/app.reducer'
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userAuthSubs: Subscription;
  isAuthenticated = false;

  constructor(
    private dataStoreService : DataStoreService, 
    private authService: AuthService,
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
    this.dataStoreService.storeRecipes();
  }

  onFetchData() {
    this.dataStoreService.fetchRecipes().subscribe();
  }

  onLogout(){
    this.authService.logout();
  }

}
