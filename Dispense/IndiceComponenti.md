# Componenti del corso Angular

Ogni componente è pensato per illustrare una specifica funzionalità di Angular.

---

## Componenti principali

- **`my-component`** — Primo componente creato nel corso. Introduce la struttura base di un componente Angular (`@Component`, `selector`, `templateUrl`) e la **interpolazione** (`{{ }}`).

- **`hello-world-component`** — Secondo componente standalone. Consolida il concetto di componente e di **interpolazione** di variabili TypeScript nel template.

- **`binding-component`** — Illustra le tre forme di **data binding**:
  - *Property binding* → `[src]`, `[disabled]`
  - *Event binding* → `(click)`
  - *Two-way binding* → `[(ngModel)]` tramite `FormsModule`

- **`direttive-component`** — Mostra le **direttive strutturali** nella sintassi moderna di Angular 17+:
  - `@if` / `@else` per mostrare/nascondere elementi
  - `@for` con `track` per il rendering di liste
  - `@switch` / `@case` / `@default` per la logica condizionale multipla
  - `[ngClass]` e `[ngStyle]` per la stilizzazione dinamica

- **`padre-component` + `figlio-component`** — Dimostrano la **comunicazione tra componenti**:
  - `@Input()` → il padre passa dati al figlio
  - `@Output()` + `EventEmitter` → il figlio emette eventi verso il padre

- **`registrazione-component`** — Introduce i **Template-driven Forms** con `FormsModule`:
  - `[(ngModel)]` per il binding bidirezionale sui campi del form
  - Gestione del submit con `(ngSubmit)`

- **`login-component`** — Illustra i **Reactive Forms** con `ReactiveFormsModule`:
  - `FormGroup` e `FormControl` per la definizione del form in TypeScript
  - `Validators` per la validazione (es. `required`, `maxLength`)
  - Accesso programmatico allo stato del form (`valid`, `value`)

- **`about-component`** — Mostra il **Routing con parametri**:
  - Lettura dei route param tramite `ActivatedRoute` e `paramMap`
  - Lifecycle hook `OnInit` (`ngOnInit`)
  - Utilizzo di un **Service** (`AuthService`) iniettato nel componente

- **`home-component`** — Pagina protetta che dimostra l'utilizzo delle **Route Guard** (`canActivate`) in combinazione con `authGuard`.

---

## Services e Guards

- **`auth-service`** — Primo esempio di **Service Angular** (`@Injectable`). Gestisce lo stato di autenticazione dell'utente (login/logout) e viene iniettato tramite **Dependency Injection**.

- **`auth-guard`** — Esempio di **Route Guard** funzionale (`CanActivateFn`). Protegge le rotte verificando lo stato di autenticazione tramite `AuthService`; in caso negativo reindirizza verso `/about`.

---

## NgRx — State Management

- **`counter` component** — Primo esempio di **NgRx**. Introduce i concetti fondamentali:
  - `Store` per accedere allo stato globale
  - `Actions` (`increment`, `decrement`, `reset`)
  - `Selectors` per selezionare una slice dello stato
  - `AsyncPipe` per gestire gli `Observable` direttamente nel template

- **`user-profile` component** — Esempio avanzato di NgRx con uno **stato più complesso** (oggetto `User`):
  - `Actions` per impostare/cancellare l'utente (`setUser`, `clearUser`)
  - Selettori multipli (`selectUser`, `selectIsLoggedIn`)
  - `AsyncPipe` + `JsonPipe` nel template
