import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

export const ChatAppRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/home/home.component').then((x) => x.HomeComponent)
    }
];