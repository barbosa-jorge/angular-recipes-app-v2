import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

export interface AuthResponseData {
  kind: string,
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {

  private loginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey;

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {
  }

  @Effect()
  authLogin = this.actions$
    .pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http.post<AuthResponseData>(this.loginUrl, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
        ).pipe(
          map(resData => {
            const expirationDate = new Date(new Date().getTime() + (+resData.expiresIn * 1000))
            return new AuthActions.Login({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationDate: expirationDate
            });
          }),
          catchError(errorResponse => {
            let errorMessage = 'An error occurred!'

            if (!errorResponse.error || !errorResponse.error.error) {
                return of(new AuthActions.LoginFail(errorMessage))
            }
    
            switch (errorResponse.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'Email already exists!';
                    break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'Email or Password invalid!';
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = 'Email or Password invalid!';
                    break;
            }
    
            return of(new AuthActions.LoginFail(errorMessage));
          })
        )
      }),
    )


  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => {
      this.router.navigate(['/'])
    })
  )

}