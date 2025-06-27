import { CommonModule } from '@angular/common';
import { Component, } from '@angular/core';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-registrazione-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './registrazione-component.html',
  styleUrl: './registrazione-component.css'
})
export class RegistrazioneComponent 
{
  utente = {nome:'', email:''};
  submitted: boolean = false;

  onSubmit(): void
  {
    this.submitted = true
  }
}
