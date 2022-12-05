import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules, NoPreloading } from '@angular/router';

const routes: Routes = [
  { 
    path: 'home', 
    loadChildren: () => import('./@chat-app/chat-app-routing.module').then(m => m.ChatAppRoutes)
  },
  {
    path: 'login',
    loadChildren: () => import('./@auth/chat-auth-routing.module').then(m => m.ChatAuthLoginRoutes)
  },
  {
    path: 'signup',
    loadChildren: () => import('./@auth/chat-auth-routing.module').then(m => m.ChatAuthSignUpRoutes)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { 
    //useHash: true
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
