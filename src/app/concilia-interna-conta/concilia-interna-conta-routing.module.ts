import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConciliaInternaContaComponent } from './concilia-interna-conta.component';

const routes: Routes = [{ path: '', component: ConciliaInternaContaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConciliaInternaContaRoutingModule {}
