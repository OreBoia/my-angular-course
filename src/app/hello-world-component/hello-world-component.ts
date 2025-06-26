import { Component } from '@angular/core';

@Component({
  selector: 'app-hello-world-component',
  imports: [],
  templateUrl: './hello-world-component.html',
  styleUrl: './hello-world-component.css'
})
export class HelloWorldComponent {
  message:string = 'Hello World! This is my second Angular component.';
}
