
import { Component, inject } from '@angular/core';
import { TasksStore } from '../state/SignalState/task.store';

@Component({
  selector: 'app-tasks',
  template: `
    <p>Totale task: {{ store.totale() }}</p>
    <p>Completate: {{ store.completate().length }}</p>

    <ul>
      @for (task of store.tasks(); track task.id) {
        <li>
          {{ task.title }}
          <button (click)="store.completa(task.id)">✓</button>
          <button (click)="store.rimuovi(task.id)">✕</button>
        </li>
      }
    </ul>

    <button (click)="aggiungiTask()">Aggiungi</button>
  `
})
export class TaskSignalStoreComponent {
  // Inietti lo store come un normale service
  store = inject(TasksStore);

  aggiungiTask() {
    this.store.aggiungi({
      id: Date.now(),
      title: 'Nuova task',
      completed: false
    });
  }
}

