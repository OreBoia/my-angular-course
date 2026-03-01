import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { authGuard } from './auth-guard';
import { AboutComponent } from './about-component/about-component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SignalsDemoComponent } from './signals-demo/signals-demo.component';
import { DirettiveComponent } from './direttive-component/direttive-component';
import { PadreComponent } from './padre-component/padre-component';
import { BindingComponent } from './binding-component/binding-component';
import { LoginComponent } from './login-component/login-component';
import { RegistrazioneComponent } from './registrazione-component/registrazione-component';
import { HelloWorldComponent } from './hello-world-component/hello-world-component';
import { MyComponent } from './my-component/my-component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'about/:utente', component: AboutComponent },
  { path: 'signals', component: SignalsDemoComponent },
  { path: 'directives', component: DirettiveComponent },
  { path: 'father-child', component: PadreComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'binding', component: BindingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrazione', component: RegistrazioneComponent },
  { path: 'hello-world', component: HelloWorldComponent },
  { path: 'my-component', component: MyComponent },
  { path: '**', redirectTo: 'about' }
];
