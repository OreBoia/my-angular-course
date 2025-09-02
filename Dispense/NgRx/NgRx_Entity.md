# NgRx Entity: Gestione di Collezioni Normalizzate

Quando si lavora con collezioni di dati, come una lista di utenti o prodotti, la gestione dello stato può diventare complessa. Dati duplicati, ricerche lente e aggiornamenti macchinosi sono problemi comuni. **NgRx Entity** è una libreria che aiuta a risolvere questi problemi fornendo un modo standard per gestire collezioni di entità in uno stato normalizzato.

## Cos'è la Normalizzazione?

Normalizzare lo stato significa organizzarlo come un piccolo database. Invece di memorizzare le entità in un array, le salviamo in un oggetto (dizionario) dove le chiavi sono gli ID delle entità. Questo rende le operazioni di ricerca, inserimento, aggiornamento e cancellazione molto più veloci ed efficienti.

Uno stato normalizzato con NgRx Entity ha questa struttura:

* `ids`: Un array contenente solo gli ID delle entità, che ne preserva l'ordine.
* `entities`: Un dizionario che mappa gli ID alle entità stesse.

## Come funziona NgRx Entity?

NgRx Entity fornisce un "adapter" che offre funzioni predefinite per manipolare lo stato della collezione. Questo riduce notevolmente il codice boilerplate che dovresti scrivere nel reducer.

## Esempi di Codice

Vediamo come gestire una collezione di `User` usando NgRx Entity.

### 1. Modello e Stato (user.model.ts, user.state.ts)

Prima definiamo il nostro modello e lo stato usando `EntityState`.

```typescript
// user.model.ts
export interface User {
  id: string; // L'ID è fondamentale per NgRx Entity
  name: string;
  email: string;
}

// user.reducer.ts (o in un file di stato separato)
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { User } from '../models/user.model';

// Definiamo lo stato estendendo EntityState
export interface State extends EntityState<User> {
  // Qui possiamo aggiungere altre proprietà di stato, se necessario
  selectedUserId: string | null;
}
```

### 2. Azioni (user.actions.ts)

Definiamo le azioni per manipolare la collezione di utenti. Queste azioni verranno dispatchate dai componenti o dagli effects.

```typescript
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { User } from '../models/user.model';

// Azioni per caricare gli utenti da un'API (usate dagli Effects)
export const loadUsers = createAction('[User Page] Load Users');
export const loadUsersSuccess = createAction('[User API] Load Users Success', props<{ users: User[] }>());
export const loadUsersFailure = createAction('[User API] Load Users Failure', props<{ error: any }>());

// Azioni per le operazioni CRUD
export const addUser = createAction('[User] Add User', props<{ user: User }>());
export const addUsers = createAction('[User] Add Users', props<{ users: User[] }>());
export const updateUser = createAction('[User] Update User', props<{ update: Update<User> }>());
export const deleteUser = createAction('[User] Delete User', props<{ id: string }>());
export const clearUsers = createAction('[User] Clear Users');
```

### 3. Creazione dell'Adapter e Stato Iniziale (user.reducer.ts)

Creiamo un'istanza dell'adapter e definiamo lo stato iniziale.

```typescript
// ... import
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { User } from '../models/user.model';

// Crea l'adapter. Possiamo passare opzioni come sortComparer o selectId.
export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

// Definisci lo stato iniziale usando l'adapter
export const initialState: State = adapter.getInitialState({
  selectedUserId: null,
});
```

### 4. Reducer con l'Adapter (user.reducer.ts)

Usiamo i metodi dell'adapter nel reducer per manipolare la collezione.

```typescript
import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
// ... adapter e initialState definiti sopra

export const userReducer = createReducer(
  initialState,
  // Aggiunge un utente
  on(UserActions.addUser, (state, { user }) => {
    return adapter.addOne(user, state);
  }),
  // Aggiunge più utenti
  on(UserActions.addUsers, (state, { users }) => {
    return adapter.addMany(users, state);
  }),
  // Aggiorna un utente
  on(UserActions.updateUser, (state, { update }) => {
    return adapter.updateOne(update, state); // update è di tipo Update<User>
  }),
  // Rimuove un utente
  on(UserActions.deleteUser, (state, { id }) => {
    return adapter.removeOne(id, state);
  }),
  // Carica tutti gli utenti (es. da un'API)
  on(UserActions.loadUsersSuccess, (state, { users }) => {
    return adapter.setAll(users, state);
  }),
  // Svuota la collezione
  on(UserActions.clearUsers, state => {
    return adapter.removeAll(state);
  })
);
```

*Nota: Le azioni (`addUser`, `updateUser`, etc.) devono essere definite separatamente nel file `user.actions.ts`.*

### 5. Selettori (user.selectors.ts)

L'adapter fornisce anche dei selettori per estrarre facilmente i dati.

```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, adapter } from './user.reducer';

// Selettore per la feature state
export const selectUserState = createFeatureSelector<State>('users');

// Estrae i selettori dall'adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// Usa i selettori base per creare selettori più specifici
export const selectUserIds = createSelector(selectUserState, selectIds);
export const selectUserEntities = createSelector(selectUserState, selectEntities);
export const selectAllUsers = createSelector(selectUserState, selectAll);
export const selectUserTotal = createSelector(selectUserState, selectTotal);

// Esempio di selettore custom
export const selectCurrentUser = createSelector(
  selectUserEntities,
  selectUserState,
  (entities, state) => state.selectedUserId ? entities[state.selectedUserId] : null
);
```

## Comandi Utili (Schematics)

Quando generi una feature con gli schematics, puoi indicare di usare NgRx Entity.

```bash
# Genera una feature completa che usa NgRx Entity
ng generate @ngrx/schematics:feature users/User --creators
```

Durante il processo, gli schematics ti chiederanno se vuoi usare NgRx Entity. Rispondendo "sì", i file verranno generati con l'adapter e la struttura di stato normalizzata.

## Tabella dei Termini Chiave

| Termine | Descrizione |
| :--- | :--- |
| **NgRx Entity** | Una libreria per gestire collezioni di dati in modo normalizzato all'interno dello stato NgRx. |
| **Normalizzazione** | La pratica di organizzare i dati per ridurre la ridondanza, memorizzando le entità in un dizionario per ID. |
| **`EntityState<T>`** | Un'interfaccia fornita da NgRx Entity che definisce la forma di uno stato normalizzato (`ids` e `entities`). |
| **`createEntityAdapter<T>`** | Una funzione factory che crea un `EntityAdapter`. Può essere configurata con un `selectId` custom o un `sortComparer`. |
| **`EntityAdapter<T>`** | Un oggetto che contiene metodi per manipolare lo stato della collezione (es. `addOne`, `updateOne`, `removeAll`). |
| **Adapter Methods** | Funzioni come `addOne`, `addMany`, `setAll`, `updateOne`, `updateMany`, `removeOne`, `removeMany` che ritornano il nuovo stato. |
| **`getInitialState()`** | Metodo dell'adapter che crea lo stato iniziale per la collezione, includendo `ids: []` e `entities: {}`. |
| **`getSelectors()`** | Metodo dell'adapter che ritorna un set di funzioni selettore di base (`selectAll`, `selectTotal`, `selectIds`, `selectEntities`). |
| **`Update<T>`** | Un tipo di dato usato per gli aggiornamenti, che contiene un `id` e un oggetto `changes` con le proprietà da modificare. |
