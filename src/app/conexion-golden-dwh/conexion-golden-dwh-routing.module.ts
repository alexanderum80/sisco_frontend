import { ConexionGoldenDwhComponent } from './conexion-golden-dwh.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: ConexionGoldenDwhComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConexionGoldenDwhRoutingModule { }
