import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

// Importa azioni e selettori
import { increment, decrement, reset } from '../state/counter.actions';
import { selectCounter, selectCountValue } from '../state/counter.selectors';

@Component({
  selector: 'app-counter',
  imports: [AsyncPipe], // AsyncPipe è fondamentale per gestire gli Observable nel template
  templateUrl: `./counter.component.html`,
})
export class CounterComponent {
  // 1. Seleziona la fetta di stato desiderata. Ottieni un Observable.
  count$: Observable<number>;

  constructor(private store: Store) {
    this.count$ = this.store.select(selectCounter);
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
