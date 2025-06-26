import { Component } from '@angular/core';
import { FiglioComponent } from "../figlio-component/figlio-component";

@Component({
  selector: 'app-padre',
  imports: [FiglioComponent],
  templateUrl: './padre-component.html',
  styleUrl: './padre-component.css'
})
export class PadreComponent 
{
  contatore: number = 0;
  
  onConteggioCambiato(nuovoValore: number): void 
  {
    this.contatore = nuovoValore;
  }
}
