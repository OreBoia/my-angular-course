import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-binding-component',
  imports: [FormsModule],
  templateUrl: './binding-component.html',
  styleUrl: './binding-component.css'
})
export class BindingComponent 
{
  userName: string = 'Edoardo';
  imageUrl: string = 'https://colorlib.com/wp/wp-content/uploads/sites/2/angular-logo.png.webp';
  messaggio: string = '';

  saluta(): void
  {
    this.messaggio = 'Ciao dal pulsante!';
  }
}
