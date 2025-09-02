import { createAction } from '@ngrx/store';

// Azione per incrementare il contatore
export const increment = createAction('[Counter Component] IncrementByOne');

// Azione per decrementare il contatore
export const decrement = createAction('[Counter Component] Decrement');

// Azione per resettare il contatore
export const reset = createAction('[Counter Component] Reset');
