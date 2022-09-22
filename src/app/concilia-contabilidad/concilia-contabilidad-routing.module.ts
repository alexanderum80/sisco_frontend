import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConciliaContabilidadComponent } from './concilia-contabilidad.component';

const routes: Routes = [{ path: '', component: ConciliaContabilidadComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ConciliaContabilidadRoutingModule {}
