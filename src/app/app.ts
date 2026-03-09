import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PadreComponent } from './padre-component/padre-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
            RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'my-angular-course';
}
