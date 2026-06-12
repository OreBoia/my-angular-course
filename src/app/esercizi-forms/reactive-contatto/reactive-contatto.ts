import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type Urgenza = 'bassa' | 'media' | 'alta';

type ContattoForm = {
  oggetto: FormControl<string>;
  messaggio: FormControl<string>;
  urgenza: FormControl<Urgenza>;
};

@Component({
  selector: 'app-reactive-contatto',
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-contatto.html',
  styleUrl: './reactive-contatto.css'
})
export class ReactiveContattoComponent {
  readonly minMessaggioLength = 10;

  readonly contactForm = new FormGroup<ContattoForm>({
    oggetto: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    messaggio: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(this.minMessaggioLength)]
    }),
    urgenza: new FormControl<Urgenza>('media', { nonNullable: true })
  });

  submittedData: { oggetto: string; messaggio: string; urgenza: Urgenza } | null = null;

  get messageLength(): number {
    return this.contactForm.controls.messaggio.value.length;
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submittedData = this.contactForm.getRawValue();
  }
}
