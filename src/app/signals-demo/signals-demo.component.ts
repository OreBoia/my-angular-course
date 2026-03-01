import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signals-demo',
  imports: [CommonModule],
  templateUrl: './signals-demo.component.html',
  styleUrl: './signals-demo.component.css'
})
export class SignalsDemoComponent {

  // ── 1. signal() ────────────────────────────────────────────────────
  // Un signal è un contenitore reattivo: quando cambia, Angular aggiorna
  // automaticamente la vista.

  contatore = signal(0);   // valore iniziale: 0
  nome      = signal('Marco');

  // ── 2. computed() ──────────────────────────────────────────────────
  // Un computed dipende da uno o più signal e si ricalcola da solo.

  doppio  = computed(() => this.contatore() * 2);
  saluto  = computed(() => 'Ciao, ' + this.nome() + '!');

  // ── 3. effect() ────────────────────────────────────────────────────
  // Un effect viene eseguito ogni volta che i signal che legge cambiano.

  logRighe: string[] = [];

  private _log = effect(() => {
    // viene riletto ogni volta che contatore o nome cambiano
    const riga = `contatore = ${this.contatore()} | nome = ${this.nome()}`;
    this.logRighe = [riga, ...this.logRighe].slice(0, 5);
  });

  // ── metodi helper ──────────────────────────────────────────────────

  incrementa()  { this.contatore.update(v => v + 1); }
  decrementa()  { this.contatore.update(v => v - 1); }
  reset()       { this.contatore.set(0); }

  aggiornaNome(event: Event) {
    const input = event.target as HTMLInputElement;
    this.nome.set(input.value);
  }
}
