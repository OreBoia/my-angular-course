import { Component, Input, Output, EventEmitter, input, output } from '@angular/core';

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

  countSignal = input<number>(0)
  countChangeSignal = output<number>();

  incrementa(): void
  {
    this.countChange.emit(this.count++);
  }

  incrementaSignal():void
  {
    this.countChangeSignal.emit(this.count++)
  }

  decrementa(): void
  {
    this.countChange.emit(this.count--);
  }

  decrementaSignal():void
  {
    this.countChangeSignal.emit(this.count--)
  }
}
