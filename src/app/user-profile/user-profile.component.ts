import { Component } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../state/user.model';
import { selectUser, selectIsLoggedIn } from '../state/user.selectors';
import { setUser, clearUser } from '../state/user.actions';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  user$: Observable<User | null>;
  isLoggedIn$: Observable<boolean>;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
  }

  login() {
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com'
    };
    this.store.dispatch(setUser({ user: mockUser }));
  }

  logout() {
    this.store.dispatch(clearUser());
  }
}
