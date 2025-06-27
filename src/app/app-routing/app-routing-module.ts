import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home-component/home-component';
import { AboutComponent } from '../about-component/about-component';
import { authGuard } from '../auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'about/:utente', component: AboutComponent },
  { path: '**', redirectTo:'about' }
];


export class AppRoutingModule { }