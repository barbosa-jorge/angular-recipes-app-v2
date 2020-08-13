import { AuthService } from './../auth.service';
import { User } from './../user.model';
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

const handleAuthentication = (resData: AuthResponseData) => {
  const expirationDate = new Date(new Date().getTime() + (+resData.expiresIn * 1000))

  let user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthenticationSuccess({
    email: resData.email,
    userId: resData.localId,
    token: resData.idToken,
    expirationDate: expirationDate,
    redirect: true
  });
}

const handleError = (errorResponse: any) => {

  let errorMessage = 'An error occurred!'

  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticationFail(errorMessage))
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

  return of(new AuthActions.AuthenticationFail(errorMessage));

}

@Injectable()
export class AuthEffects {

  private loginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey;
  private signUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey;

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
  }

  // Note: We cannot throw errors or returns observables containing errors in the effect pipe. 
  // Effects works different than services.

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignUpStart) => { // switch observables, map actions observable to success handle auth observable
      return this.http
        .post<AuthResponseData>(this.signUpUrl,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }).pipe(
            tap(resData => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000)
            }),
            map(resData => handleAuthentication(resData)),
            catchError(errorResponse => handleError(errorResponse))
          )
    })
  )

  @Effect()
  authLogin = this.actions$
    .pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {   // it maps to a new observable
        return this.http.post<AuthResponseData>(this.loginUrl, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
        ).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
          }),
          map(resData => handleAuthentication(resData)), // returns observable with authentication success action
          catchError(errorResponse => handleError(errorResponse))  // returns obs containing fail action, but doesn't throw error or stop the process
        )
      })
    )

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATION_SUCCESS),
    tap((authActions: AuthActions.AuthenticationSuccess) => {
      if (authActions.payload.redirect) {
        this.router.navigate(['/'])
      }
    })
  )

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth'])
    })
  )

  @Effect()
  authAutoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {

      const user: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: Date
      } = JSON.parse(localStorage.getItem('userData'));

      if (!user) {
        return {type: 'DUMMY'}
      }

      const loadedUser = new User(
        user.email,
        user.id,
        user._token,
        new Date(user._tokenExpirationDate)
      );

      if (loadedUser.token) {
        
        const expirationDuration = 
          new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
        
        this.authService.setLogoutTimer(expirationDuration);
        
        return new AuthActions.AuthenticationSuccess(
          {
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser._token,
            expirationDate: loadedUser._tokenExpirationDate, 
            redirect: false
          }
        );

      } else {
        return {type: 'DUMMY'}
      }
    })
  )

}