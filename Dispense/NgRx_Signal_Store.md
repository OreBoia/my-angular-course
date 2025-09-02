# NgRx Signal Store: Introduzione e Utilizzo

Con l'avvento dei Signals in Angular, NgRx ha introdotto una nuova e potente soluzione per la gestione dello stato: **SignalStore**. A partire dalla versione 17 di NgRx, SignalStore offre un approccio più moderno, leggero e dichiarativo, integrandosi perfettamente con le primitive reattive di Angular e riducendo drasticamente il boilerplate associato ad azioni, reducer ed effects tradizionali.

## Cos'è SignalStore?

SignalStore è una libreria che permette di creare uno store reattivo basato sui Signals. Invece di definire azioni, reducer e selettori separatamente, si definisce un unico store che contiene:

* **State**: Lo stato dell'applicazione, esposto come segnali (`Signal`).
* **Methods**: Funzioni per modificare lo stato in modo sicuro e prevedibile.
* **Computed Signals**: Valori derivati dallo stato, che si aggiornano automaticamente quando lo stato cambia.
* **RxJS Integration**: Metodi per gestire side effects (come chiamate API) usando la potenza di RxJS.

Questo approccio unifica la logica di stato, rendendola più semplice da scrivere, leggere e mantenere.

## Esempi di Codice

Vediamo come creare e utilizzare un `SignalStore` per gestire una lista di "to-do".

### 1. Definire il SignalStore

Creiamo uno store per i nostri to-do. Lo store avrà uno stato iniziale, un metodo per aggiungere un to-do e un valore computato per contare i to-do completati.

```typescript
// todos.store.ts
import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { TodosService } from './todos.service'; // Un servizio per le chiamate API

// Definiamo la forma del nostro stato
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodosState {
  todos: Todo[];
  loading: boolean;
  filter: 'all' | 'pending' | 'completed';
}

const initialState: TodosState = {
  todos: [],
  loading: false,
  filter: 'all',
};

// Creiamo il SignalStore
export const TodosStore = signalStore(
  // 1. Definiamo lo stato iniziale
  withState(initialState),

  // 2. Definiamo i metodi per modificare lo stato
  withMethods((store) => ({
    addTodo(text: string) {
      const newTodo: Todo = { id: Date.now().toString(), text, completed: false };
      // patchState aggiorna lo stato in modo immutabile
      patchState(store, (state) => ({ todos: [...state.todos, newTodo] }));
    },
    toggleCompleted(id: string) {
      patchState(store, (state) => ({
        todos: state.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      }));
    },
    setFilter(filter: 'all' | 'pending' | 'completed') {
        patchState(store, { filter });
    }
  })),

  // 3. Definiamo i valori computati
  withComputed((state) => ({
    completedCount: computed(() => state.todos().filter(t => t.completed).length),
    filteredTodos: computed(() => {
        const todos = state.todos();
        switch(state.filter()) {
            case 'pending': return todos.filter(t => !t.completed);
            case 'completed': return todos.filter(t => t.completed);
            default: return todos;
        }
    })
  })),
  
  // 4. Gestione degli effetti con RxJS (opzionale)
  withMethods((store, todosService = inject(TodosService)) => ({
    loadTodos: rxMethod<void>(
        pipe(
            tap(() => patchState(store, { loading: true })),
            switchMap(() => todosService.getTodos().pipe(
                tap(todos => patchState(store, { todos, loading: false }))
            ))
        )
    )
  }))
);
```

### 2. Fornire lo Store

Il `SignalStore` è un servizio e va fornito a livello di componente o a livello di root.

```typescript
// app.config.ts o nel provider di un componente
import { ApplicationConfig } from '@angular/core';
import { TodosStore } from './todos.store';

export const appConfig: ApplicationConfig = {
  providers: [TodosStore] // Fornisce lo store all'applicazione
};
```

### 3. Usare lo Store in un Componente

Iniettiamo lo store nel componente e usiamo i suoi segnali e metodi.

```typescript
// todos.component.ts
import { Component, inject } from '@angular/core';
import { TodosStore } from './todos.store';

@Component({
  selector: 'app-todos',
  template: `
    <h2>To-Do List ({{ store.completedCount() }} completati)</h2>
    
    <div>
        <button (click)="store.setFilter('all')">Tutti</button>
        <button (click)="store.setFilter('pending')">Da fare</button>
        <button (click)="store.setFilter('completed')">Completati</button>
    </div>

    <ul>
      <li *ngFor="let todo of store.filteredTodos()">
        <span (click)="store.toggleCompleted(todo.id)" 
              [style.textDecoration]="todo.completed ? 'line-through' : 'none'">
          {{ todo.text }}
        </span>
      </li>
    </ul>
    <input #newTodo (keyup.enter)="add(newTodo.value); newTodo.value = ''" placeholder="Nuovo to-do">
    <button (click)="add(newTodo.value); newTodo.value = ''">Aggiungi</button>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class TodosComponent {
  // Iniettiamo lo store. È già un servizio!
  readonly store = inject(TodosStore);

  add(text: string) {
    if (text) {
      this.store.addTodo(text);
    }
  }
}
```

## Comandi Utili

Attualmente, non esistono comandi specifici di NgRx Schematics per `SignalStore` come `ng generate @ngrx/schematics:signal-store`. Tuttavia, poiché un `SignalStore` è essenzialmente un servizio Angular, puoi iniziare generando un servizio standard:

```bash
# Genera un servizio che puoi trasformare in un SignalStore
ng generate service path/to/your-store --skip-tests
```

## Tabella dei Termini Chiave

| Termine | Descrizione |
| :--- | :--- |
| **`signalStore`** | La funzione principale per creare un nuovo `SignalStore`. |
| **`withState`** | Una funzione "builder" che definisce la forma e il valore iniziale dello stato dello store. |
| **`withMethods`** | Una funzione "builder" che aggiunge metodi allo store per modificare lo stato. |
| **`patchState`** | La funzione usata all'interno dei metodi per aggiornare lo stato in modo immutabile e sicuro. |
| **`withComputed`** | Una funzione "builder" che aggiunge segnali computati, derivati dallo stato principale. |
| **`rxMethod`** | Un bridge verso RxJS per gestire side effects. Trasforma un Observable in un metodo che può essere chiamato. |
| **`inject`** | Funzione di Angular usata per l'iniezione di dipendenze, utile per iniettare servizi (come `HttpClient`) nei metodi dello store. |
