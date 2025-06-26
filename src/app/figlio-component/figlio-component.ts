import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-figlio-component',
  imports: [],
  templateUrl: './figlio-component.html',
  styleUrl: './figlio-component.css'
})
export class FiglioComponent 
{
  @Input() count: number = 0;
  @Output() countChanged: EventEmitter<number> = new EventEmitter<number>();

  incrementa(): void
  {
    this.count++;
    this.countChanged.emit(this.count)
  }
}
