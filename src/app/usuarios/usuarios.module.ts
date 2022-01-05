import { ListUsuariosComponent } from './list-usuarios/list-usuarios.component';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { AngularMaterialComponentsModule } from '../angular-material/angular-material.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PrimeTableModule } from '../shared/ui/prime-ng/table/table.module';
import { PrimeInputTextModule } from '../shared/ui/prime-ng/input-text/input-text.module';
import { PrimePasswordModule } from '../shared/ui/prime-ng/password/password.module';
import { PrimeDropdownModule } from '../shared/ui/prime-ng/dropdown/dropdown.module';
import { PrimeCheckboxModule } from '../shared/ui/prime-ng/checkbox/checkbox.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsuariosRoutingModule,
    AngularMaterialComponentsModule,
    SharedModule,
    PrimeTableModule,
    PrimePasswordModule,
    PrimeInputTextModule,
    PrimeDropdownModule,
    PrimeCheckboxModule
  ],
  declarations: [ListUsuariosComponent, UsuarioFormComponent, ChangePasswordComponent],
})
export class UsuariosModule { }
