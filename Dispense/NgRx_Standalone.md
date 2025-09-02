# NgRx Store con Angular Standalone: Setup e Gestione dello Stato

Con l'introduzione dei componenti Standalone in Angular, anche il modo di configurare librerie come NgRx è cambiato, diventando più snello e basato sui provider. Questa guida spiega come impostare e utilizzare NgRx Store in un'applicazione Angular 20 moderna.

## Che cos'è NgRx Store?

NgRx Store è una libreria per la gestione dello stato (state management) ispirata a Redux. Fornisce un modo strutturato e prevedibile per gestire lo stato della tua applicazione, specialmente in scenari complessi. I principi fondamentali sono:

1. **Single Source of Truth (Unica Fonte di Verità)**: Lo stato dell'intera applicazione è conservato in un unico oggetto (lo Store).
2. **State is Read-Only (Stato di Sola Lettura)**: L'unico modo per modificare lo stato è emettere un'**Azione** (Action), un oggetto che descrive l'evento accaduto.
3. **Changes are made with Pure Functions (Le Modifiche sono Fatte con Funzioni Pure)**: Per specificare come lo stato viene trasformato dalle azioni, si usano funzioni pure chiamate **Reducer**.

---

## 1. Installazione

Per iniziare, installa la libreria NgRx Store:

```bash
npm install @ngrx/store
# o
ng add @ngrx/store@latest
```

---

## 2. Setup in un'applicazione Standalone

In un'applicazione basata su componenti standalone, la configurazione di NgRx avviene nel file `app.config.ts` (o dove si trova la configurazione del bootstrap) utilizzando `provideStore`.

**`src/app/app.config.ts`**

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';

// Importa i tuoi reducer qui (li creeremo tra poco)
// import { counterReducer } from './state/counter.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Fornisce lo store globale all'applicazione
    // Il primo argomento è un oggetto che mappa i nomi delle "fette" di stato ai loro reducer
    provideStore({ /* counter: counterReducer */ }) 
  ]
};
```

---

## 3. I Concetti Chiave di NgRx: Esempio del Contatore

Creiamo un semplice contatore per illustrare i concetti di Actions, Reducers e Selectors.

### a. Actions (Azioni)

Le azioni descrivono eventi unici che accadono nell'applicazione. Sono il punto di partenza per ogni modifica dello stato.

**`src/app/state/counter.actions.ts`**

```typescript
import { createAction } from '@ngrx/store';

// Azione per incrementare il contatore
export const increment = createAction('[Counter Component] Increment');

// Azione per decrementare il contatore
export const decrement = createAction('[Counter Component] Decrement');

// Azione per resettare il contatore
export const reset = createAction('[Counter Component] Reset');
```

*La convenzione `[Sorgente] Evento` aiuta a capire da dove proviene l'azione e cosa fa.*

### b. Reducer

Un reducer è una funzione pura che prende lo stato corrente e un'azione, e restituisce un nuovo stato.

**`src/app/state/counter.reducer.ts`**

```typescript
import { createReducer, on } from '@ngrx/store';
import { increment, decrement, reset } from './counter.actions';

// 1. Definisci lo stato iniziale
export const initialState = 0;

// 2. Crea il reducer
export const counterReducer = createReducer(
  initialState,
  // La funzione 'on' associa un'azione a una logica di trasformazione dello stato
  on(increment, (state) => state + 1),
  on(decrement, (state) => state - 1),
  on(reset, (state) => 0)
);
```

*Il reducer non modifica mai lo stato originale, ma ne restituisce sempre una nuova copia.*

### c. Registrare il Reducer

Ora che abbiamo il reducer, registriamolo nel nostro `app.config.ts`.

**`src/app/app.config.ts` (aggiornato)**

```typescript
// ...
import { provideStore } from '@ngrx/store';
import { counterReducer } from './state/counter.reducer'; // Importa il reducer

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideStore({ counter: counterReducer }) // Mappa la fetta 'counter' al suo reducer
  ]
};
```

### d. Selectors (Selettori)

I selettori sono funzioni pure e memoizzate usate per ottenere "fette" (slice) dello stato. La memoizzazione significa che se lo stato non è cambiato, il selettore restituisce l'ultimo risultato calcolato, ottimizzando le performance.

**`src/app/state/counter.selectors.ts`**

```typescript
import { createSelector, createFeatureSelector } from '@ngrx/store';

// 1. Crea un "feature selector" per ottenere la fetta di stato 'counter'
export const selectCounter = createFeatureSelector<number>('counter');

// 2. (Opzionale) Puoi creare selettori più complessi che dipendono da altri selettori
// In questo caso, è identico al feature selector, ma mostra la sintassi
export const selectCountValue = createSelector(
  selectCounter,
  (count) => count
);
```

---

## 4. Utilizzo in un Componente Standalone

Ora usiamo tutto in un componente per mostrare il contatore e interagire con esso.

**`src/app/counter/counter.component.ts`**

```typescript
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// Importa azioni e selettori
import { increment, decrement, reset } from '../state/counter.actions';
import { selectCountValue } from '../state/counter.selectors';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [AsyncPipe], // AsyncPipe è fondamentale per gestire gli Observable nel template
  template: `
    <h2>Contatore NgRx</h2>
    
    <!-- Usiamo il pipe 'async' per sottoscrivere l'Observable e mostrare il valore -->
    <p>Valore attuale: {{ count$ | async }}</p>
    
    <button (click)="increment()">Incrementa</button>
    <button (click)="decrement()">Decrementa</button>
    <button (click)="reset()">Resetta</button>
  `,
})
export class CounterComponent {
  // 1. Seleziona la fetta di stato desiderata. Ottieni un Observable.
  count$: Observable<number>;

  constructor(private store: Store) {
    this.count$ = this.store.select(selectCountValue);
  }

  // 2. Metodi che "dispatchano" (innescano) le azioni
  increment() {
    this.store.dispatch(increment());
  }

  decrement() {
    this.store.dispatch(decrement());
  }

  reset() {
    this.store.dispatch(reset());
  }
}
```

### Approfondimento: Come funziona `{{ count$ | async }}`?

L'espressione `{{ count$ | async }}` è una delle feature più potenti e comode di Angular per lavorare con dati asincroni. Analizziamola pezzo per pezzo:

* **`count$`**: Questa è la variabile nella classe del componente. La convenzione del suffisso `$` indica che non contiene un valore diretto (come un numero), ma un **Observable**. Un Observable è un flusso di dati che emette valori nel tempo. Nel nostro caso, `count$` emetterà un nuovo numero ogni volta che il contatore nello store cambia.

* **`|` (Pipe Operator)**: Nel contesto dei template Angular, l'operatore `|` prende il valore alla sua sinistra (l'Observable `count$`) e lo "incanala" nella funzione di trasformazione alla sua destra (il pipe `async`).

* **`async` (AsyncPipe)**: Questo è un pipe speciale fornito da Angular che svolge tre compiti cruciali:

  1. **Sottoscrizione Automatica**: Si sottoscrive all'Observable `count$`, mettendosi in ascolto di nuovi valori.
  2. **Restituzione del Valore**: Quando `count$` emette un valore (es. `5`), l'AsyncPipe lo "estrae" e lo restituisce al template per la visualizzazione.
  3. **Unsubscription Automatica**: Quando il componente viene distrutto, l'AsyncPipe annulla automaticamente la sottoscrizione. Questo è fondamentale per prevenire **memory leak** (perdite di memoria).

* **`{{ ... }}` (Interpolazione)**: Questa è la sintassi standard di Angular per visualizzare il valore restituito dall'AsyncPipe nel DOM.

**In sintesi**, l'espressione `{{ count$ | async }}` è una scorciatoia che dice ad Angular: "Prendi questo flusso di dati `count$`, gestisci tu la sottoscrizione e l'annullamento, e ogni volta che arriva un nuovo valore, mostralo qui."

Senza l'AsyncPipe, saresti costretto a sottoscrivere manualmente l'Observable nel file TypeScript, salvare il valore in una variabile separata e ricordarti di annullare la sottoscrizione nel lifecycle hook `ngOnDestroy`, rendendo il codice più verboso e soggetto a errori.

### Come Funziona Esattamente il `dispatch`? (Approfondimento)

Pensa allo `store.dispatch()` come al **sistema di annunci** di un'intera applicazione. Quando vuoi che accada qualcosa che modifica lo stato, non lo modifichi direttamente. Invece, "annunci" un'intenzione di cambiamento. Questo annuncio è l'**Azione**.

1. **Cos'è un'Azione?**
    Un'azione è un semplice oggetto JavaScript con una proprietà fondamentale: `type`. Il `type` è una stringa univoca che descrive l'evento accaduto. Ad esempio:

    ```typescript
    // Dietro le quinte, l'azione creata da createAction è simile a questo:
    {
      type: '[Counter Component] Increment'
    }
    ```

    La funzione `createAction('[Sorgente] Evento')` che abbiamo usato è una scorciatoia per creare queste azioni in modo sicuro e standardizzato, evitando errori di battitura nel `type`.

2. **Come Funziona `store.dispatch(azione)`?**
    Quando chiami `this.store.dispatch(increment())`, stai facendo due cose:
    * `increment()`: Esegui la funzione "action creator" che restituisce l'oggetto azione `{ type: '[Counter Component] Increment' }`.
    * `store.dispatch(...)`: Prendi questo oggetto azione e lo invii allo Store NgRx.

3. **Il Viaggio dell'Azione: Dal Dispatch al Reducer**
    Qui avviene la magia. Lo Store non sa cosa fare con l'azione. Il suo unico compito è passarla a **tutti i reducer registrati** nell'applicazione.

    Immagina i reducer come dei dipartimenti specializzati. Ogni reducer riceve l'azione e la esamina, chiedendosi: "Questa azione mi riguarda?".

    Il collegamento avviene tramite il `type` dell'azione. Nel nostro `counter.reducer.ts`, abbiamo usato la funzione `on()`:

    ```typescript
    on(increment, (state) => state + 1),
    ```

    * `on(increment, ...)`: Questa riga dice al reducer: "Quando ricevi un'azione che corrisponde a quella creata da `increment`, esegui la funzione che segue".
    * **Corrispondenza**: NgRx associa internamente la funzione `increment` al suo `type` stringa (`'[Counter Component] Increment'`). Quando un'azione con quel `type` arriva, il reducer sa esattamente quale pezzo di logica eseguire.

Se un reducer riceve un'azione che non riconosce (cioè, per cui non ha un gestore `on()`), la ignora semplicemente e restituisce lo stato così com'è, senza modificarlo.

In sintesi, il `dispatch` è il grilletto. L'**azione** è il proiettile, e il suo `type` è la sua "firma balistica". Il **reducer** è il bersaglio che sa riconoscere quella specifica firma e reagire di conseguenza, producendo un nuovo stato. Questo disaccoppiamento è ciò che rende NgRx potente e prevedibile.

### Flusso di Dati Riepilogato

---

## 5. Gestire Oggetti Complessi: Esempio dell'Utente

Mentre un contatore è ottimo per iniziare, le applicazioni reali gestiscono dati più complessi, come oggetti utente, liste di prodotti, ecc. Vediamo come gestire un oggetto `User`.

### a. Definire il Modello di Stato

Prima di tutto, definiamo la forma del nostro stato.

**`src/app/state/user.model.ts`**

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
}
```

Lo stato che gestiamo nel reducer sarà leggermente più complesso del solo modello `User`.

**`src/app/state/user.reducer.ts` (Stato Iniziale)**

```typescript
import { User } from './user.model';

// Definiamo una "fetta" di stato più complessa
export interface UserState {
  user: User | null;
}

export const initialState: UserState = {
  user: null,
};
```

### b. Actions con Payload

Quando vogliamo salvare un utente, l'azione deve "trasportare" i dati dell'utente. Questo "carico" si chiama **payload**.

**`src/app/state/user.actions.ts`**

```typescript
import { createAction, props } from '@ngrx/store';
import { User } from './user.model';

// L'azione 'setUser' accetta un payload di tipo { user: User }
export const setUser = createAction(
  '[User] Set User',
  props<{ user: User }>()
);

export const clearUser = createAction('[User] Clear User');
```

*La funzione `props<{...}>()` definisce la forma del payload che l'azione trasporterà.*

### c. Reducer per uno Stato Complesso

Il reducer ora gestirà oggetti invece di semplici numeri. È fondamentale non mutare mai lo stato, ma restituire sempre un nuovo oggetto. L'operatore spread (`...`) è il nostro migliore amico qui.

**`src/app/state/user.reducer.ts`**

```typescript
import { createReducer, on } from '@ngrx/store';
import { setUser, clearUser } from './user.actions';
import { UserState, initialState } from './user.reducer';

export const userReducer = createReducer(
  initialState,
  
  // Quando l'utente viene impostato, copia lo stato esistente e aggiorna la proprietà 'user'
  on(setUser, (state, { user }) => ({ 
    ...state, 
    user: user 
  })),

  // Quando l'utente viene rimosso
  on(clearUser, (state) => ({ 
    ...state, 
    user: null 
  }))
);
```

### d. Registrare il Nuovo Reducer

Come per il contatore, aggiungiamo `userReducer` al nostro store globale. Assicurati che sia già presente nel tuo `app.config.ts`.

**`src/app/app.config.ts` (esempio)**

```typescript
// ...
import { userReducer } from './state/user.reducer';
import { counterReducer } from './state/counter.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideStore({ 
      counter: counterReducer,
      user: userReducer // Aggiungiamo la nuova fetta di stato
    })
  ]
};
```

### e. Selettori per Dati Complessi

I selettori diventano ancora più utili con stati complessi, permettendoci di estrarre e combinare dati specifici.

**`src/app/state/user.selectors.ts`**

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

// 1. Selettore per la feature 'user'
export const selectUserState = createFeatureSelector<UserState>('user');

// 2. Selettore che estrae solo l'oggetto utente
export const selectUser = createSelector(
  selectUserState,
  (state) => state.user
);

// 3. Selettore che estrae lo stato di login (derivato)
export const selectIsLoggedIn = createSelector(
  selectUser,
  (user) => user !== null // Restituisce true se l'utente esiste, altrimenti false
);
```

### f. Utilizzo nel Componente

Infine, ecco come un componente può interagire con lo stato dell'utente.

**`src/app/user-profile/user-profile.component.ts`**

```typescript
import { Component } from '@angular/core';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../state/user.model';
import { selectUser, selectIsLoggedIn } from '../state/user.selectors';
import { setUser, clearUser } from '../state/user.actions';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, NgIf],
  template: `
    <div *ngIf="isLoggedIn$ | async; else loggedOut">
      <h3>Benvenuto, {{ (user$ | async)?.name }}!</h3>
      <pre>{{ user$ | async | json }}</pre>
      <button (click)="logout()">Logout</button>
    </div>
    <ng-template #loggedOut>
      <h3>Nessun utente loggato.</h3>
      <button (click)="login()">Login</button>
    </ng-template>
  `,
})
export class UserProfileComponent {
  user$: Observable<User | null>;
  isLoggedIn$: Observable<boolean>;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  login() {
    const mockUser: User = {
      id: '1',
      name: 'Jane Doe',
      email: 'jane.doe@example.com'
    };
    // Spediamo l'azione con il payload dell'utente
    this.store.dispatch(setUser({ user: mockUser }));
  }

  logout() {
    this.store.dispatch(clearUser());
  }
}
```

### Flusso di Dati Riepilogato

1. **Componente**: Un utente clicca un bottone, e il componente chiama un metodo come `increment()`.
2. **Dispatch di un'Azione**: Il metodo `increment()` usa `store.dispatch()` per inviare l'azione `increment`.
3. **Reducer**: Lo Store passa l'azione e lo stato corrente al `counterReducer`. Il reducer, vedendo l'azione `increment`, restituisce un nuovo stato con il valore aumentato di 1.
4. **Stato Aggiornato**: Lo Store salva il nuovo stato.
5. **Selettore e Observable**: Il selettore `selectCountValue` rileva il cambiamento e l'Observable `count$` emette il nuovo valore.
6. **UI Aggiornata**: Il pipe `async` nel template riceve il nuovo valore e aggiorna la vista.
