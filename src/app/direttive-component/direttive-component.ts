import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-direttive-component',
  imports: [CommonModule, FormsModule],
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

  aggiungiTecnologia(nuovaTecnologia: string): void {

      this.tecnologie.push(nuovaTecnologia);
  }
}
