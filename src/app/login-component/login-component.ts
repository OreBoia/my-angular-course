import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl<string>("", Validators.required),
    password: new FormControl<string>("", [Validators.required, Validators.maxLength(6)])
  })

  onLogin(): void
  {
    if(this.loginForm.valid)
      {
        const datiLogin = this.loginForm.value;
        console.log('login effettuato per', datiLogin.username)
      }
  }
}
