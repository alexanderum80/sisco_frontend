import { PrimeCalendarModule } from './../shared/ui/prime-ng/calendar/calendar.module';
import { PrimeDropdownModule } from './../shared/ui/prime-ng/dropdown/dropdown.module';
import { PrimeButtonModule } from './../shared/ui/prime-ng/button/button.module';
import { PrimeProgressSpinnerModule } from './../shared/ui/prime-ng/progress-spinner/progress-spinner.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformeCuentasCobrarPagarRoutingModule } from './informe-cuentas-cobrar-pagar-routing.module';
import { InformeCuentasCobrarPagarComponent } from './informe-cuentas-cobrar-pagar.component';
import { InformeCuentasCobrarPagarFormComponent } from './informe-cuentas-cobrar-pagar-form/informe-cuentas-cobrar-pagar-form/informe-cuentas-cobrar-pagar-form.component';

@NgModule({
  declarations: [
    InformeCuentasCobrarPagarComponent,
    InformeCuentasCobrarPagarFormComponent,
  ],
  imports: [
    CommonModule,
    InformeCuentasCobrarPagarRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeProgressSpinnerModule,
    PrimeButtonModule,
    PrimeDropdownModule,
    PrimeCalendarModule,
  ],
})
export class InformeCuentasCobrarPagarModule {}
