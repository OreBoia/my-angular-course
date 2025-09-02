import { createSelector, createFeatureSelector } from '@ngrx/store';

// 1. Crea un "feature selector" per ottenere la fetta di stato 'counter'
export const selectCounter = createFeatureSelector<number>('counter');

// 2. (Opzionale) Puoi creare selettori più complessi che dipendono da altri selettori
// In questo caso, è identico al feature selector, ma mostra la sintassi
export const selectCountValue = createSelector(
  selectCounter,
  (count) => count
);
