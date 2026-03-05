import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  email, form, FormField,
  required, minLength, maxLength, pattern
} from '@angular/forms/signals';

interface ContactData {
  name: string;
  email: string;
  phone: string;
  age: number;
  message: string;
}

@Component({
  selector: 'app-signal-forms-component',
  imports:[ FormField,
            FormsModule],
  templateUrl: './signal-forms-component.component.html',
  styleUrl: './signal-forms-component.component.css',
})
export class SignalFormsComponentComponent
{

  contactModel = signal<ContactData>({
    name: '',
    email: '',
    phone: '',
    age: 0,
    message: '',
  });

  contactForm = form(this.contactModel, (schema) => {
    // Nome: obbligatorio, minimo 2 caratteri, massimo 50
    required(schema.name, { message: 'Il nome è obbligatorio' });
    minLength(schema.name, 2, { message: 'Minimo 2 caratteri' });
    maxLength(schema.name, 50, { message: 'Massimo 50 caratteri' });

    // Email: obbligatoria + formato valido
    required(schema.email, { message: "L'email è obbligatoria" });
    email(schema.email, { message: 'Formato email non valido' });

    // Telefono: obbligatorio + pattern regex
    required(schema.phone, { message: 'Il telefono è obbligatorio' });
    pattern(schema.phone, /^\+?[0-9]{8,15}$/, {
      message: 'Inserisci un numero valido (8-15 cifre)',
    });

    // Messaggio: obbligatorio, lunghezza tra 10 e 500
    required(schema.message, { message: 'Il messaggio è obbligatorio' });
    minLength(schema.message, 10, { message: 'Scrivi almeno 10 caratteri' });
    maxLength(schema.message, 500, { message: 'Massimo 500 caratteri' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    console.log('Dati:', this.contactModel());
  }
}

