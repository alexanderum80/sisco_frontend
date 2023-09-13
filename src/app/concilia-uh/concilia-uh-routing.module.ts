import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConciliaUhComponent } from './concilia-uh.component';

const routes: Routes = [{ path: '', component: ConciliaUhComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConciliaUhRoutingModule {}
