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
