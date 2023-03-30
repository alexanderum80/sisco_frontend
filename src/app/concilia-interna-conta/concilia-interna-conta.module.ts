import { PrimeFieldsetModule } from './../shared/ui/prime-ng/fieldset/fieldset.module';
import { PrimeTableModule } from './../shared/ui/prime-ng/table/table.module';
import { ConciliaInternaContaService } from './shared/services/concilia-interna-conta.service';
import { PrimeCheckboxModule } from './../shared/ui/prime-ng/checkbox/checkbox.module';
import { PrimeCalendarModule } from './../shared/ui/prime-ng/calendar/calendar.module';
import { PrimeButtonModule } from './../shared/ui/prime-ng/button/button.module';
import { PrimeDropdownModule } from './../shared/ui/prime-ng/dropdown/dropdown.module';
import { PrimeRadioButtonModule } from './../shared/ui/prime-ng/radio-button/radio-button.module';
import { PrimeCardModule } from './../shared/ui/prime-ng/card/card.module';
import { PrimePanelModule } from './../shared/ui/prime-ng/panel/panel.module';
import { PrimeProgressSpinnerModule } from './../shared/ui/prime-ng/progress-spinner/progress-spinner.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConciliaInternaContaRoutingModule } from './concilia-interna-conta-routing.module';
import { ConciliaInternaContaComponent } from './concilia-interna-conta.component';
import { PrimeSplitButtonModule } from '../shared/ui/prime-ng/split-button/split-button.module';

@NgModule({
  declarations: [ConciliaInternaContaComponent],
  imports: [
    CommonModule,
    ConciliaInternaContaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeProgressSpinnerModule,
    PrimePanelModule,
    PrimeCardModule,
    PrimeRadioButtonModule,
    PrimeDropdownModule,
    PrimeButtonModule,
    PrimeSplitButtonModule,
    PrimeCalendarModule,
    PrimeCheckboxModule,
    PrimeTableModule,
    PrimeFieldsetModule,
  ],
  providers: [ConciliaInternaContaService],
})
export class ConciliaInternaContaModule {}
