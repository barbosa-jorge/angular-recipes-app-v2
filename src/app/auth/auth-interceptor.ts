import { exhaustMap, take, map } from 'rxjs/operators';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable({providedIn: 'root'})
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private store: Store<fromApp.AppState>
    ) {}

    /* 
       exhaustMap: waits the first observable to completo (after take(1)),
       then it gets the result and you can map it to another observable
       take(1) // get the value and unsubscribe from observable after that.
    */

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return this.store.select('auth').pipe(     // first observable
            take(1),   
            map(authStore => authStore.user),
            exhaustMap(user => {
                if (!user) {
                    return next.handle(request);
                }
                const modifiedRequest = request.clone({
                    params: new HttpParams().set('auth', user.token)
                });
                return next.handle(modifiedRequest);  // second observable
            })
        )
    }
}