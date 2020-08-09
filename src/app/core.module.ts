import { AuthInterceptorService } from './auth/auth-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RecipeService } from './recipes/recipe.service';
import { NgModule } from '@angular/core';

@NgModule({
  providers: [
    RecipeService, 
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptorService, 
      multi: true 
    }
  ]
})
export class CoreModule {

}