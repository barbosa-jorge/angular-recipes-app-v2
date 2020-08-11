import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as AuthActions from '../auth/store/auth.actions';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
    private storeSubscription: Subscription;
    isLoginMode = true;
    isLoading = false;
    error: string = '';

    constructor(
        private authService: AuthService, 
        private router: Router,
        private store: Store<fromApp.AppState>) {
    }

    ngOnInit() {
        this.storeSubscription = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.isLoading;
            this.error = authState.authError;
        })
    }

    ngOnDestroy() {
        if (this.storeSubscription) {
            this,this.storeSubscription.unsubscribe();
        }
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {

        const { email, password } = form.value;
        const authData = { email, password };

        if (this.isLoginMode) {
            this.store.dispatch(new AuthActions.LoginStart(authData))
        } else {
            this.store.dispatch(new AuthActions.SignUpStart(authData))           
        }

        form.reset();
    }

    onHandleClose() {
        this.store.dispatch(new AuthActions.ClearError());
    }
}