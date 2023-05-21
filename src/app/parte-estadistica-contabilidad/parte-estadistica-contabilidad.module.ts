import { PrimeTooltipModule } from '../shared/ui/prime-ng/tooltip/tooltip.module';
import { PrimeButtonModule } from '../shared/ui/prime-ng/button/button.module';
import { PrimeCalendarModule } from '../shared/ui/prime-ng/calendar/calendar.module';
import { PrimeCardModule } from '../shared/ui/prime-ng/card/card.module';
import { PrimeDropdownModule } from '../shared/ui/prime-ng/dropdown/dropdown.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimePanelModule } from '../shared/ui/prime-ng/panel/panel.module';
import { PrimeProgressSpinnerModule } from '../shared/ui/prime-ng/progress-spinner/progress-spinner.module';
import { PrimeTableModule } from '../shared/ui/prime-ng/table/table.module';
import { ParteEstadisticaContabilidadService } from './shared/services/parte-estadistica-contabilidad.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParteEstadisticaContabilidadRoutingModule } from './parte-estadistica-contabilidad-routing.module';
import { ParteEstadisticaContabilidadComponent } from './parte-estadistica-contabilidad.component';

@NgModule({
  declarations: [ParteEstadisticaContabilidadComponent],
  imports: [
    CommonModule,
    ParteEstadisticaContabilidadRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimePanelModule,
    PrimeCardModule,
    PrimeTableModule,
    PrimeProgressSpinnerModule,
    PrimeDropdownModule,
    PrimeCalendarModule,
    PrimeButtonModule,
    PrimeTooltipModule,
  ],
  providers: [ParteEstadisticaContabilidadService],
})
export class ParteEstadisticaContabilidadModule {}
