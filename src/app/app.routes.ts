import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { authGuard } from './auth-guard';
import { AboutComponent } from './about-component/about-component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'about/:utente', component: AboutComponent },
  { path: '**', redirectTo:'about' }
];
