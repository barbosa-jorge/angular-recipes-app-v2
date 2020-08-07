import { AuthService, AuthResponseData } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error: string = '';

    constructor(private authService: AuthService, private router: Router) {
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
            authObservable = this.authService.login(email, password);
        } else {
            authObservable = this.authService.signup(email, password)              
        }

        authObservable.subscribe(response => {
            console.log(response);
            this.isLoading = false;
            this.error = '';
            this.router.navigate(['/recipes'])
        }, errorMessage => {
            console.log('error: ', errorMessage)
            this.isLoading = false;
            this.error = errorMessage;
        });

        form.reset();
    }

    onHandleClose() {
       this.error = null;       
    }
}