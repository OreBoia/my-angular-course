# Introduzione ai Route Guards in Angular

Route Guards sono dei servizi che permettono di controllare l'accesso alle rotte di un'applicazione Angular. In questo modo è possibile, ad esempio, impedire a un utente non autenticato di accedere a una determinata pagina.

Esistono 5 tipi di Route Guards in Angular:

* **CanActivate**: Controlla se è possibile accedere a una rotta.
* **CanDeactivate**: Controlla se è possibile abbandonare una rotta.
* **CanLoad**: Controlla se è possibile caricare un modulo lazy-loaded.
* **Resolve**: Esegue una logica prima di accedere a una rotta, ad esempio per recuperare dei dati.
* **CanActivateChild**: Controlla se è possibile accedere a una rotta figlia.

Ecco un esempio di come utilizzare i Route Guards in un'applicazione Angular.

## **1. Creare un servizio di autenticazione**

Innanzitutto, creiamo un servizio di autenticazione che ci permetta di verificare se un utente è autenticato o meno.

```typescript
// src/app/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  login() {
    this.isAuthenticated = true;
  }

  logout() {
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
```

## **2. Creare un Route Guard**

Ora creiamo un Route Guard che utilizzi il servizio di autenticazione per controllare l'accesso a una rotta.

```typescript
// src/app/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
```

## **3. Configurare le rotte**

Infine, configuriamo le rotte in modo da utilizzare il Route Guard per proteggere la rotta `/admin`.

```typescript
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

In questo modo, se un utente non autenticato cerca di accedere alla rotta `/admin`, verrà reindirizzato alla pagina di login.

Questo è solo un esempio di base di come utilizzare i Route Guards in Angular. È possibile utilizzarli in molti altri modi, ad esempio per controllare l'accesso a rotte figlie, per caricare dati prima di accedere a una rotta o per impedire a un utente di abbandonare una pagina con dati non salvati.
