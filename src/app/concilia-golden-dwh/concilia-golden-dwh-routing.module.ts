import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConciliaGoldenDwhComponent } from './concilia-golden-dwh.component';

const routes: Routes = [{ path: '', component: ConciliaGoldenDwhComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConciliaGoldenDwhRoutingModule {}
