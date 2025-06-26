import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-direttive-component',
  imports: [CommonModule],
  templateUrl: './direttive-component.html',
  styleUrl: './direttive-component.css'
})
export class DirettiveComponent {
  isVisible: boolean = true;

  mostraLista:boolean = true;
  tecnologie: string[] = ['Angular', 'React', 'Vue'];
  techPreferita: string = 'React';

  toggleLista() : void
  {
    this.mostraLista = !this.mostraLista;
  }
}
