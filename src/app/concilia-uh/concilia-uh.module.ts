import { PrimeButtonModule } from './../shared/ui/prime-ng/button/button.module';
import { PrimeInputTextareaModule } from './../shared/ui/prime-ng/input-textarea/input-textarea.module';
import { PrimeTableModule } from './../shared/ui/prime-ng/table/table.module';
import { PrimeTabViewModule } from '../shared/ui/prime-ng/tab-view/tab-view.module';
import { PrimeProgressSpinnerModule } from '../shared/ui/prime-ng/progress-spinner/progress-spinner.module';
import { PrimeCalendarModule } from './../shared/ui/prime-ng/calendar/calendar.module';
import { PrimeDropdownModule } from './../shared/ui/prime-ng/dropdown/dropdown.module';
import { PrimeRadioButtonModule } from './../shared/ui/prime-ng/radio-button/radio-button.module';
import { PrimeCardModule } from './../shared/ui/prime-ng/card/card.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimePanelModule } from './../shared/ui/prime-ng/panel/panel.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConciliaUhRoutingModule } from './concilia-uh-routing.module';
import { ConciliaUhComponent } from './concilia-uh.component';

@NgModule({
    declarations: [ConciliaUhComponent],
    imports: [
        CommonModule,
        ConciliaUhRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeProgressSpinnerModule,
        PrimePanelModule,
        PrimeCardModule,
        PrimeRadioButtonModule,
        PrimeDropdownModule,
        PrimeCalendarModule,
        PrimeTabViewModule,
        PrimeTableModule,
        PrimeInputTextareaModule,
        PrimeButtonModule,
    ],
})
export class ConciliaUhModule {}
