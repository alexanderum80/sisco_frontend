import { AbstractControl, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TooltipService {
  constructor() {}

  getFormControlTooltip(control: AbstractControl, tooltip: string): string {
    let returnTooltip = tooltip;
    if (!control.valid && control.dirty) {
      if (control.errors!['required']) {
        returnTooltip = 'Este campo es obligatorio.';
      }
      if (control.errors!['minLength']) {
        returnTooltip = 'Muy pocos caracteres.';
      }
      if (control.errors!['maxlength']) {
        returnTooltip = 'Demasiados caracteres.';
      }
    }
    return returnTooltip;
  }

  getToolTipStyleClass(control: AbstractControl): string {
    return !control.valid && control.dirty ? 'p-error' : '';
  }
}
