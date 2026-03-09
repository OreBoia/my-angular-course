import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = signal(false);
  private role = signal<'admin' | 'user'>('user');
  private plan = signal<'premium' | 'basic'>('basic');

  login(options?: { role?: 'admin' | 'user'; plan?: 'premium' | 'basic' }): void {
    this.loggedIn.set(true);

    if (options?.role) {
      this.role.set(options.role);
    }

    if (options?.plan) {
      this.plan.set(options.plan);
    }
  }

  logout(): void {
    this.loggedIn.set(false);
  }

  isLoggedIn(): boolean {
    return this.loggedIn();
  }

  getRole(): 'admin' | 'user' {
    return this.role();
  }

  getPlan(): 'premium' | 'basic' {
    return this.plan();
  }

  // Backward-compatible alias used in other lessons.
  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}
