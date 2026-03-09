
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service/auth-service';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  loginForm: FormGroup = new FormGroup({
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    role: new FormControl<'admin' | 'user'>('user', { nonNullable: true }),
    plan: new FormControl<'premium' | 'basic'>('basic', { nonNullable: true })
  });

  onLogin(): void {
    if (!this.loginForm.valid) {
      return;
    }

    const datiLogin = this.loginForm.getRawValue();
    this.authService.login({ role: datiLogin.role, plan: datiLogin.plan });
    console.log('Login effettuato per', datiLogin.username, '| ruolo:', datiLogin.role, '| piano:', datiLogin.plan);
    void this.router.navigate(['/dashboard']);
  }
}
