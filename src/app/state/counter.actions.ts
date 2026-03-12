import { createAction } from '@ngrx/store';

// Azione per incrementare il contatore
export const increment = createAction('[CounterComponent] IncrementByOne');

// Azione per decrementare il contatore
export const decrement = createAction('[CounterComponent] Decrement');

// Azione per resettare il contatore
export const reset = createAction('[CounterComponent] Reset');
