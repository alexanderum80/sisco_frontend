import { PrimeMultiSelectModule } from './multi-select/multi-select.module';
import { PrimeToolbarModule } from './toolbar/toolbar.module';
import { PrimeProgressSpinnerModule } from './progress-spinner/progress-spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeDropdownModule } from './dropdown/dropdown.module';
import { PrimeInputTextModule } from './input-text/input-text.module';
import { PrimeInputMaskModule } from './input-mask/input-mask.module';
import { PrimePasswordModule } from './password/password.module';
import { PrimeSplitButtonModule } from './split-button/split-button.module';
import { PrimeButtonModule } from './button/button.module';
import { PrimeCalendarModule } from './calendar/calendar.module';
import { PrimeNGConfig } from 'primeng/api';
import { PrimeCheckboxModule } from './checkbox/checkbox.module';
import { PrimeRadioButtonModule } from './radio-button/radio-button.module';
import { PrimeTooltipModule } from './tooltip/tooltip.module';
import { PrimeTableModule } from './table/table.module';
import { PrimeDialogModule } from './dialog/dialog.module';
import { PrimeMenubarModule } from './menubar/menubar.module';
import { PrimeSlideMenuModule } from './slide-menu/slide-menu.module';
import { PrimePanelModule } from './panel/panel.module';
import { PrimeDinamicDialogModule } from './dinamic-dialog/dinamic-dialog.module';
import { PrimeConfirmPopupModule } from './confirm-popup/confirm-popup.module';
import { PrimeTabViewModule } from './tab-view/tab-view.module';
import { PrimeCardModule } from './card/card.module';
import { PrimeToastModule } from './toast/toast.module';

const modules = [
  PrimeButtonModule,
  PrimeCalendarModule,
  PrimeCardModule,
  PrimeCheckboxModule,
  PrimeConfirmPopupModule,
  PrimeDialogModule,
  PrimeDinamicDialogModule,
  PrimeDropdownModule,
  PrimeInputMaskModule,
  PrimeInputTextModule,
  PrimeMenubarModule,
  PrimeMultiSelectModule,
  PrimePanelModule,
  PrimePasswordModule,
  PrimeProgressSpinnerModule,
  PrimeRadioButtonModule,
  PrimeSlideMenuModule,
  PrimeSplitButtonModule,
  PrimeTabViewModule,
  PrimeTableModule,
  PrimeToastModule,
  PrimeToolbarModule,
  PrimeTooltipModule,
];

@NgModule({
  imports: [ CommonModule, modules ],
  exports: [ modules ],
})
export class PrimeNgModule {
  constructor(
    private config: PrimeNGConfig
  ) {
    config.setTranslation({
      accept: 'Sí',
      reject: 'No',
      cancel: 'Cancelar',
      emptyMessage: 'No hay datos que mostrar',
      startsWith: 'Comienza con',
      contains: 'Contiene',
      notContains: 'No contiene',
      endsWith: 'Termina con',
      equals: 'Igual',
      notEquals: 'No es igual',
      noFilter: 'Sin filtro',
      dateIs: 'Fecha es',
      dateIsNot: 'Fecha no es',
      dateAfter: 'Fecha después de',
      dateBefore: 'Fecha antes de',
      dateFormat: 'Formato de fecha',      
    });
   }
 }
