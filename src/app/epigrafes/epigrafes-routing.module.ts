import { ListEpigrafesComponent } from './list-epigrafes/list-epigrafes.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: ListEpigrafesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EpigrafesRoutingModule {}
