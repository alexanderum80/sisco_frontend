import { EstadoConexionRodasComponent } from './estado-conexion/estado-conexion.component';
import { ListConexionRodasComponent } from './list-conexion-rodas/list-conexion-rodas.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: ListConexionRodasComponent },
  { path: 'estado', component: EstadoConexionRodasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConexionRodasRoutingModule { }
