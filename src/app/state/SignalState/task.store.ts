import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// 1. Definisci la forma dello stato
interface TasksState {
  tasks: Task[];
  loading: boolean;
}

// 2. Crea lo store
export const TasksStore = signalStore(
  { providedIn: 'root' },

  // Stato iniziale
  withState<TasksState>({
    tasks: [],
    loading: false
  }),

  // Valori derivati (come i Selectors del vecchio NgRx)
  withComputed((store) => ({
    completate: computed(() =>
      store.tasks().filter(t => t.completed)
    ),
    totale: computed(() => store.tasks().length)
  })),

  // Metodi per modificare lo stato (come Actions + Reducers)
  withMethods((store) => ({
    aggiungi(task: Task) {
      patchState(store, {
        tasks: [...store.tasks(), task]
      });
    },
    rimuovi(id: number) {
      patchState(store, {
        tasks: store.tasks().filter(t => t.id !== id)
      });
    },
    completa(id: number) {
      patchState(store, {
        tasks: store.tasks().map(t =>
          t.id === id ? { ...t, completed: true } : t
        )
      });
    }
  }))
);
