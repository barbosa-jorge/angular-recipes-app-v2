import { map, take } from 'rxjs/operators';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store<fromApp.AppState>, 
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot) 
      : boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {

        return this.store.select('auth').pipe(
          take(1),
          map(authStore => authStore.user),
          map(user => {
            const isAuth = !!user;
            if (isAuth) {
                return true;
            }
            return this.router.createUrlTree(['/auth'])
          })
        )
  }

}