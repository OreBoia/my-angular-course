import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-edit',
  standalone: true,
  templateUrl: './edit-component.html'
})
export class EditComponent {
  savedValue = signal('');
  currentValue = signal('');

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.currentValue.set(target?.value ?? '');
  }

  save(): void {
    this.savedValue.set(this.currentValue());
  }

  hasUnsavedChanges(): boolean {
    return this.savedValue() !== this.currentValue();
  }
}
