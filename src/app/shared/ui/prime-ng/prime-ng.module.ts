import { PrimeSelectButtonModule } from './select-button/select-button.module';
import { PrimeFileUploadModule } from './file-upload/file-upload.module';
import { PrimeDataViewModule } from './data-view/data-view.module';
import { PrimeInputSwitchModule } from './input-switch/input-switch.module';
import { PrimeSidebarModule } from './sidebar/sidebar.module';
import { PrimePanelMenuModule } from './panel-menu/panel-menu.module';
import { PrimeInputNumberModule } from './input-number/input-number.module';
import { PrimeFieldsetModule } from './fieldset/fieldset.module';
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
import { PrimeInputTextareaModule } from './input-textarea/input-textarea.module';
import { PrimeNGConfig } from 'primeng/api';
import { PrimeInputEmailModule } from './input-email/input-email.module';

const modules = [
  PrimeButtonModule,
  PrimeCalendarModule,
  PrimeCardModule,
  PrimeCheckboxModule,
  PrimeConfirmPopupModule,
  PrimeDataViewModule,
  PrimeDialogModule,
  PrimeDinamicDialogModule,
  PrimeDropdownModule,
  PrimeInputEmailModule,
  PrimeFieldsetModule,
  PrimeFileUploadModule,
  PrimeInputMaskModule,
  PrimeInputNumberModule,
  PrimeInputTextModule,
  PrimeInputTextareaModule,
  PrimeInputSwitchModule,
  PrimeMenubarModule,
  PrimeMultiSelectModule,
  PrimePanelModule,
  PrimePanelMenuModule,
  PrimePasswordModule,
  PrimeProgressSpinnerModule,
  PrimeRadioButtonModule,
  PrimeSelectButtonModule,
  PrimeSidebarModule,
  PrimeSlideMenuModule,
  PrimeSplitButtonModule,
  PrimeTabViewModule,
  PrimeTableModule,
  PrimeToolbarModule,
  PrimeTooltipModule,
];

@NgModule({
  imports: [CommonModule, modules],
  exports: [modules],
  declarations: [],
})
export class PrimeNgModule {
  constructor(private config: PrimeNGConfig) {
    this.config.setTranslation({
      startsWith: 'Comienza con',
      contains: 'Contiene',
      notContains: 'No contiene',
      endsWith: 'Termina con',
      equals: 'Igual',
      notEquals: 'No es igual',
      noFilter: 'Sin filtro',
      lt: 'Menor que',
      lte: 'Menor que o igual a',
      gt: 'Mayor que',
      gte: 'Mayor que o igual a',
      is: 'Es',
      isNot: 'No es',
      before: 'Antes',
      after: 'Después',
      dateIs: 'Fecha es',
      dateIsNot: 'Fecha no es',
      dateBefore: 'Fecha antes de',
      dateAfter: 'Fecha después de',
      clear: 'Limpiar',
      apply: 'Aplicar',
      matchAll: 'Coincidir todo',
      matchAny: 'Coincidir cualquiera',
      addRule: 'Agregar regla',
      removeRule: 'Eliminar regla',
      accept: 'Sí',
      reject: 'No',
      choose: 'Seleccionar',
      upload: 'Subir',
      cancel: 'Cancelar',
      dayNames: [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
      ],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      monthNamesShort: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ],
      dateFormat: 'Formato de fecha',
      today: 'Hoy',
      weekHeader: 'Se',
      weak: 'Débil',
      medium: 'Medio',
      strong: 'Fuerte',
      passwordPrompt: 'Introduzca la contraseña',
      emptyMessage: 'No hay datos para mostrar',
      emptyFilterMessage: 'No se ha encontrado coincidencia',
    });
  }
}
