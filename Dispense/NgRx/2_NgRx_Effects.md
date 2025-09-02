# NgRx Effects: Gestione dei Side Effects e Interazione con le API

Gli Effects in NgRx sono un componente fondamentale per gestire le operazioni asincrone, comunemente chiamate "side effects", come le chiamate HTTP a un'API. Permettono di isolare questa logica dal resto dell'applicazione, mantenendo i reducers puri e sincroni.

## Come funzionano gli Effects?

Quando un'azione viene dispatchata nello store, gli effects possono "ascoltare" questo stream di azioni. Se un'azione corrisponde a un tipo specifico che l'effect sta osservando, l'effect esegue una sequenza di operazioni (es. una chiamata a un servizio). Al termine di questa operazione, l'effect dispatcha una o più nuove azioni per notificare allo store il risultato (es. successo o fallimento dell'operazione).

In sintesi, il flusso è questo:
1.  **Componente**: Dispatcha un'azione per avviare un'operazione (es. `[Products Page] Load Products`).
2.  **Effect**: Intercetta l'azione `[Products Page] Load Products`, chiama un servizio che fa una richiesta HTTP per caricare i prodotti.
3.  **API**: Restituisce i dati.
4.  **Effect**: Riceve i dati dal servizio e dispatcha un'azione di successo con i dati come payload (es. `[Products API] Load Products Success`). In caso di errore, dispatcherebbe un'azione di fallimento (es. `[Products API] Load Products Failure`).
5.  **Reducer**: Gestisce l'azione di successo (o fallimento) e aggiorna lo stato dell'applicazione.

## Esempi di Codice

Vediamo un esempio pratico per caricare una lista di prodotti da un'API.

### 1. Azioni (products.actions.ts)

Definiamo tre azioni: una per iniziare il caricamento, una per il successo e una per l'errore.

```typescript
import { createAction, props } from '@ngrx/store';
import { Product } from '../models/product.model'; // Modello di esempio

// Azione per avviare il caricamento dei prodotti
export const loadProducts = createAction(
  '[Products Page] Load Products'
);

// Azione in caso di successo, con i prodotti come payload
export const loadProductsSuccess = createAction(
  '[Products API] Load Products Success',
  props<{ products: Product[] }>()
);

// Azione in caso di fallimento, con l'errore come payload
export const loadProductsFailure = createAction(
  '[Products API] Load Products Failure',
  props<{ error: any }>()
);
```

### 2. Effect (products.effects.ts)

L'effect ascolta l'azione `loadProducts`, chiama il servizio `ProductsService` e dispatcha `loadProductsSuccess` o `loadProductsFailure`.

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ProductsService } from '../services/products.service'; // Servizio per le chiamate HTTP
import * as ProductsActions from './products.actions';

@Injectable()
export class ProductsEffects {

  loadProducts$ = createEffect(() => this.actions$.pipe(
    ofType(ProductsActions.loadProducts), // Filtra solo per questa azione
    mergeMap(() => this.productsService.getProducts().pipe(
      map(products => ProductsActions.loadProductsSuccess({ products })), // Dispatcha l'azione di successo
      catchError(error => of(ProductsActions.loadProductsFailure({ error }))) // Dispatcha l'azione di fallimento
    ))
  ));

  constructor(
    private actions$: Actions,
    private productsService: ProductsService
  ) {}
}
```

### 3. Reducer (products.reducer.ts)

Il reducer gestisce le azioni di successo e fallimento per aggiornare lo stato.

```typescript
import { createReducer, on } from '@ngrx/store';
import * as ProductsActions from './products.actions';
import { Product } from '../models/product.model';

export interface State {
  products: Product[];
  loading: boolean;
  error: any;
}

export const initialState: State = {
  products: [],
  loading: false,
  error: null,
};

export const productsReducer = createReducer(
  initialState,
  on(ProductsActions.loadProducts, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductsActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products: products,
    loading: false
  })),
  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error
  }))
);
```

### 4. Fornire gli Effects (app.config.ts per Standalone API)

Perché gli effects siano attivi, devono essere registrati.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ProductsEffects } from './products.effects';
import { productsReducer } from './products.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({ products: productsReducer }), // Fornisce i reducers
    provideEffects([ProductsEffects]) // Fornisce gli effects
  ]
};
```

## Comandi Utili (Schematics)

Per generare rapidamente i file NgRx, puoi usare Angular CLI con NgRx Schematics:

```bash
# Genera le azioni
ng generate @ngrx/schematics:action Product --creators=loadProducts,loadProductsSuccess,loadProductsFailure

# Genera l'effect
ng generate @ngrx/schematics:effect Product --group

# Genera il reducer
ng generate @ngrx/schematics:reducer Product --group

# Genera la feature completa (azioni, reducer, effects)
ng generate @ngrx/schematics:feature products/Product --creators
```

## Tabella dei Termini Chiave

| Termine | Descrizione |
| :--- | :--- |
| **Effect** | Una classe `@Injectable` che ascolta le azioni dispatchate, esegue side effects e dispatcha nuove azioni. |
| **Side Effect** | Qualsiasi interazione con il mondo esterno al di fuori dell'applicazione Angular, come chiamate HTTP, WebSocket o accesso al `localStorage`. |
| **Actions** | Un servizio NgRx iniettabile che rappresenta uno stream RxJS di tutte le azioni dispatchate nell'applicazione. |
| **`createEffect()`** | Una funzione factory che crea un effect. Riceve una funzione che ritorna uno stream di azioni. |
| **`ofType()`** | Un operatore RxJS fornito da NgRx per filtrare lo stream di `Actions` in base al tipo di azione. |
| **`mergeMap`** | Operatore RxJS usato per mappare un valore (l'azione) a un Observable interno (la chiamata HTTP) e "appiattire" il risultato. |
| **`map`** | Operatore RxJS per trasformare il risultato di successo della chiamata HTTP in un'azione di successo. |
| **`catchError`** | Operatore RxJS per intercettare errori dall'Observable e trasformarli in un'azione di fallimento. |
| **Dispatch** | L'atto di inviare un'azione allo store NgRx per avviare una modifica dello stato o un side effect. |
| **`provideEffects()`** | Funzione usata nelle applicazioni Standalone per registrare le classi di effects. |
