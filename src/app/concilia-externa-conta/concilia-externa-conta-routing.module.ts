import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConciliaExternaContaComponent } from './concilia-externa-conta.component';

const routes: Routes = [{ path: '', component: ConciliaExternaContaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConciliaExternaContaRoutingModule { }
