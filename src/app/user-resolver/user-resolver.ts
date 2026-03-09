import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { User, UserService } from '../user-service/user-service';

export const userResolver: ResolveFn<User | undefined> = (route) => {
  const userService = inject(UserService);
  const id = route.paramMap.get('id') ?? '';

  return userService.getUserAsync(id);
};
