import { CanDeactivateFn } from '@angular/router';
import { EditComponent } from '../edit-component/edit-component';

export const unsavedChangesGuard: CanDeactivateFn<EditComponent> = (component: EditComponent) => {
  if (component.hasUnsavedChanges()) {
    return confirm('Hai modifiche non salvate. Vuoi davvero uscire?');
  }

  return true;
};
