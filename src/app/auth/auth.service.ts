import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { User } from './user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

export interface AuthResponseData {
    kind: string,
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private signUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey;
    private loginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey;
    private tokenExpirationTimer: any;
    userSub = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient, private router: Router) {
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(this.loginUrl,
            {
                email,
                password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            tap(responseData => this.handleAuthentication(responseData.email,
                responseData.localId, responseData.idToken, +responseData.expiresIn)
            )
        )
    }

    logout() {
        this.userSub.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('loggedUser');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
    }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(this.signUpUrl,
            {
                email,
                password,
                returnSecureToken: true
            })
            .pipe(
                catchError(this.handleError),
                tap(responseData => this.handleAuthentication(responseData.email,
                    responseData.localId, responseData.idToken, +responseData.expiresIn)
                )
            );
    }

    autoLogin() {
        
        const user: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: Date
        } = JSON.parse(localStorage.getItem('loggedUser'));
        if (!user) {
            return;
        }

        const loadedUser = new User(
            user.email,
            user.id,
            user._token,
            new Date(user._tokenExpirationDate)
        );    

        if (loadedUser.token) {
            this.userSub.next(loadedUser);
            const expirationDate = new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDate);
        }  
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    private handleAuthentication(email: string, localId: string, idToken: string,
        expiresIn: number) {

        const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000))
        const user = new User(email, localId, idToken, expirationDate);

        this.userSub.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('loggedUser', JSON.stringify(user));
    }

    private handleError(errorResponse: HttpErrorResponse) {

        let errorMessage = 'An error occurred!'

        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
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

        return throwError(errorMessage);
    }
}