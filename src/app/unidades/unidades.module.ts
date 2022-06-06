import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnidadesRoutingModule } from './unidades-routing.module';
import { ListUnidadesComponent } from './list-unidades/list-unidades.component';

@NgModule({
  declarations: [ListUnidadesComponent],
  imports: [CommonModule, UnidadesRoutingModule],
})
export class UnidadesModule {}
