import { CheckboxGroupModule } from './checkbox-group/checkbox-group.module';
import { PaginatorModule } from './paginator/paginator.module';
import { ModalModule } from './modal/modal.module';
import { ExpansionPanelModule } from './expansion-panel/expansion-panel.module';
import { CheckboxModule } from './checkbox/checkbox.module';
import { RadioButtonModule } from './radio-button/radio-button.module';
import { SpinnerModule } from './spinner/spinner.module';
import { TextareaModule } from './textarea/textarea.module';
import { InputModule } from './input/input.module';
import { TableModule } from './table/table.module';
import { DatePickerModule } from './date-picker/date-picker.module';
import { ButtonModule } from './button/button.module';
import { SelectModule } from './select/select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

import { ButtonMenuModule } from './button-menu/button-menu.module';
import { CardModule } from './card/card.module';

const modules = [
  // app modules
  ButtonModule,
  ButtonMenuModule,
  CardModule,
  CheckboxModule,
  CheckboxGroupModule,
  DatePickerModule,
  InputModule,
  RadioButtonModule,
  SelectModule,
  SpinnerModule,
  TableModule,
  TextareaModule,
  ExpansionPanelModule,
  ModalModule,
  PaginatorModule,

  // material modules
  MatTabsModule,
  MatMenuModule,
  MatFormFieldModule,
  MatIconModule,
  MatBadgeModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatDialogModule,
  MatSlideToggleModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatDividerModule,
];


@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, modules],
  exports: [modules],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ]
})
export class AngularMaterialComponentsModule { }
