import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

export const ChatAuthLoginRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/login/login.component').then((x) => x.LoginComponent)
    }
];

export const ChatAuthSignUpRoutes: Routes = [
    { 
        path: '', 
        loadComponent: () => import('./components/signup/signup.component').then((x) => x.SignupComponent),
    }
];