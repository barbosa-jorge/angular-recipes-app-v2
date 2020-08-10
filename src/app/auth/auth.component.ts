import { AppState } from './../store/app.reducer';
import { AuthService, AuthResponseData } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as AuthActions from '../auth/store/auth.actions';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
    isLoginMode = true;
    isLoading = false;
    error: string = '';

    constructor(
        private authService: AuthService, 
        private router: Router,
        private store: Store<fromApp.AppState>) {
    }

    ngOnInit() {
        this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.isLoading;
            this.error = authState.authError;
        })
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {

        const email = form.value.email;
        const password = form.value.password;
        this.isLoading = true;

        let authObservable: Observable<AuthResponseData>;

        if (this.isLoginMode) {
            this.store.dispatch(new AuthActions.LoginStart({email, password}))
        } else {
            authObservable = this.authService.signup(email, password)              
        }

        // authObservable.subscribe(response => {
        //     console.log(response);
        //     this.isLoading = false;
        //     this.error = '';
        //     this.router.navigate(['/recipes'])
        // }, errorMessage => {
        //     console.log('error: ', errorMessage)
        //     this.isLoading = false;
        //     this.error = errorMessage;
        // });

        form.reset();
    }

    onHandleClose() {
       this.error = null;       
    }
}