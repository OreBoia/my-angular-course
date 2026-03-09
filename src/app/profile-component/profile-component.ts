import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '../user-service/user-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile-component.html'
})
export class ProfileComponent {
  private route = inject(ActivatedRoute);
  user = this.route.snapshot.data['user'] as User | undefined;
}
