import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return this.authService.userSub.pipe(
            take(1),
            exhaustMap(user => {
                if (!user) {
                    return next.handle(request);
                }
                const modifiedRequest = request.clone({
                    params: new HttpParams().set('auth', user.token)
                });
                return next.handle(modifiedRequest);
            })
        )
    }
}