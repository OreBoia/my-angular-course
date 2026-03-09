import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { authGuard } from './auth-guard/auth-guard';
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
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { ProductsComponent } from './products-component/products-component';
import { AdminComponent } from './admin-component/admin-component';
import { adminGuard } from './admin-guard/admin-guard';
import { UsersComponent } from './users-component/users-component';
import { SettingsComponent } from './settings-component/settings-component';
import { EditComponent } from './edit-component/edit-component';
import { unsavedChangesGuard } from './unsaved-changes-guard/unsaved-changes-guard';
import { premiumGuard } from './premium-guard/premium-guard';
import { PremiumReportComponent } from './premium-report-component/premium-report-component';
import { BasicReportComponent } from './basic-report-component/basic-report-component';
import { ProfileComponent } from './profile-component/profile-component';
import { userResolver } from './user-resolver/user-resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'about/:utente', component: AboutComponent },

  // 1) canActivate
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },

  // 2) canActivateChild
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    canActivateChild: [adminGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'users' },
      { path: 'users', component: UsersComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },

  // 3) canDeactivate
  { path: 'edit', component: EditComponent, canDeactivate: [unsavedChangesGuard] },

  // 4) canMatch
  { path: 'report', canMatch: [premiumGuard], component: PremiumReportComponent },
  { path: 'report', component: BasicReportComponent },

  // 5) resolve
  { path: 'profile/:id', component: ProfileComponent, resolve: { user: userResolver } },

  { path: 'signals', component: SignalsDemoComponent },
  { path: 'directives', component: DirettiveComponent },
  { path: 'father-child', component: PadreComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'binding', component: BindingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrazione', component: RegistrazioneComponent },
  { path: 'hello-world', component: HelloWorldComponent },
  { path: 'my-component', component: MyComponent },
  { path: '**', redirectTo: 'home' }
];
