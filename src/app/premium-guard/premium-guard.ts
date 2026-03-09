import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../auth-service/auth-service';

export const premiumGuard: CanMatchFn = () => {
  const auth = inject(AuthService);

  // If false, Angular evaluates the next route with the same path.
  return auth.getPlan() === 'premium';
};
