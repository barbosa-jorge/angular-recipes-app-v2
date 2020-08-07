import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

/**
 * I'am using load lazying
 */
const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    // { path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule' } - old way
    { 
      path: 'recipes', 
      loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) 
    },
    { 
      path: 'shopping-list', 
      loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule) 
    },
    { 
      path: 'auth', 
      loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) 
    }
];


/** I'm using preLoadingStrategy: PreLoadAllModules
 * It has a fast initial load
 * Keep modules in separated bundles 
 * Faster nagivation to the loaded modules.
 */
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}