import { CommonModule } from '@angular/common';
import { Component, input, inject, resource, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../user-service/user-service';

@Component({
  selector: 'app-user-profile',
  imports: [RouterLink, CommonModule],
  templateUrl:'user-profile.component.html'
})
export class UserProfileComponent
{
  // Il router inietta automaticamente il parametro :id qui
  id = input.required<string>()

  private userService = inject(UserService)

  //Promise - asincrono
  userResource = resource({
    params: () => ({ id: this.id() }),
    loader: ({ params }) => this.userService.getUserAsync(params.id)
  });

  //Computed - sincrono
  user = computed(() => this.userService.getUserSync(this.id()));
}
