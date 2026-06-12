import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-template-driven-registrazione',
  imports: [FormsModule],
  templateUrl: './template-driven-registrazione.html',
  styleUrl: './template-driven-registrazione.css'
})
export class TemplateDrivenRegistrazioneComponent {
  utente = {
    nome: '',
    email: '',
    eta: null as number | null
  };

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    console.log(form.value);
  }
}
