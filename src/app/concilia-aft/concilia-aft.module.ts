import { PrimeInputTextareaModule } from './../shared/ui/prime-ng/input-textarea/input-textarea.module';
import { PrimeButtonModule } from './../shared/ui/prime-ng/button/button.module';
import { PrimeTabViewModule } from './../shared/ui/prime-ng/tab-view/tab-view.module';
import { PrimeCheckboxModule } from './../shared/ui/prime-ng/checkbox/checkbox.module';
import { PrimeCalendarModule } from './../shared/ui/prime-ng/calendar/calendar.module';
import { PrimeDropdownModule } from './../shared/ui/prime-ng/dropdown/dropdown.module';
import { PrimeRadioButtonModule } from './../shared/ui/prime-ng/radio-button/radio-button.module';
import { PrimePanelModule } from './../shared/ui/prime-ng/panel/panel.module';
import { PrimeProgressSpinnerModule } from './../shared/ui/prime-ng/progress-spinner/progress-spinner.module';
import { PrimeInputTextModule } from './../shared/ui/prime-ng/input-text/input-text.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConciliaAftService } from './shared/services/concilia-aft.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConciliaAftRoutingModule } from './concilia-aft-routing.module';
import { ConciliaAftComponent } from './concilia-aft.component';
import { PrimeCardModule } from '../shared/ui/prime-ng/card/card.module';
import { PrimeTableModule } from '../shared/ui/prime-ng/table/table.module';

@NgModule({
  declarations: [ConciliaAftComponent],
  imports: [
    CommonModule,
    ConciliaAftRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeInputTextModule,
    PrimeProgressSpinnerModule,
    PrimePanelModule,
    PrimeCardModule,
    PrimeRadioButtonModule,
    PrimeDropdownModule,
    PrimeCalendarModule,
    PrimeCheckboxModule,
    PrimeTabViewModule,
    PrimeTableModule,
    PrimeButtonModule,
    PrimeInputTextareaModule,
  ],
  providers: [ConciliaAftService],
})
export class ConciliaAftModule {}
