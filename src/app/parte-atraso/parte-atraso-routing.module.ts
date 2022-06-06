import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParteAtrasoComponent } from './parte-atraso.component';

const routes: Routes = [{ path: '', component: ParteAtrasoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParteAtrasoRoutingModule {}
