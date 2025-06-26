import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-figlio',
  imports: [],
  templateUrl: './figlio-component.html',
  styleUrl: './figlio-component.css'
})
export class FiglioComponent 
{
  @Input() count: number = 0;
  @Output() countChange: EventEmitter<number> = new EventEmitter<number>();

  incrementa(): void 
  {
    this.count++;
    this.countChange.emit(this.count);
  }

  decrementa(): void 
  {
    this.count--;
    this.countChange.emit(this.count);
  }
}
