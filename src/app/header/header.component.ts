import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { DataStoreService } from './../shared/data-storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userAuthSubs: Subscription;
  isAuthenticated = false;

  constructor(private dataStoreService : DataStoreService, 
    private authService: AuthService) {
  }

  ngOnInit() {
    this.userAuthSubs = this.authService.userSub
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
