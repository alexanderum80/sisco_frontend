import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConciliaExternaDwhComponent } from './concilia-externa-dwh.component';

const routes: Routes = [{ path: '', component: ConciliaExternaDwhComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConciliaExternaDwhRoutingModule {}
