import { PrimeCardModule } from './../shared/ui/prime-ng/card/card.module';
import { ListUsuariosComponent } from './list-usuarios/list-usuarios.component';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PrimeTableModule } from '../shared/ui/prime-ng/table/table.module';
import { PrimeInputTextModule } from '../shared/ui/prime-ng/input-text/input-text.module';
import { PrimePasswordModule } from '../shared/ui/prime-ng/password/password.module';
import { PrimeDropdownModule } from '../shared/ui/prime-ng/dropdown/dropdown.module';
import { PrimeCheckboxModule } from '../shared/ui/prime-ng/checkbox/checkbox.module';
import { PrimeToastModule } from '../shared/ui/prime-ng/toast/toast.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsuariosRoutingModule,
    SharedModule,
    PrimeTableModule,
    PrimePasswordModule,
    PrimeInputTextModule,
    PrimeDropdownModule,
    PrimeCheckboxModule,
    PrimeToastModule,
    PrimeCardModule,
  ],
  declarations: [
    ListUsuariosComponent,
    UsuarioFormComponent,
    ChangePasswordComponent,
  ],
})
export class UsuariosModule {}
