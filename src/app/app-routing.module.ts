import { StartComponent } from './shared/ui/start/start.component';
import { AuthGuard } from './shared/services/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './usuarios/login/login.component';

const routes: Routes = [
    { path: '', component: StartComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },

    // Configuracion general
    {
        path: 'usuarios',
        loadChildren: () =>
            import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'conexion-rodas',
        loadChildren: () =>
            import('./conexion-rodas/conexion-rodas.module').then(
                m => m.ConexionRodasModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'conexion-dwh',
        loadChildren: () =>
            import('./conexion-golden-dwh/conexion-golden-dwh.module').then(
                m => m.ConexionGoldenDwhModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'empleados',
        loadChildren: () =>
            import('./empleados/empleados.module').then(m => m.EmpleadosModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'supervisores',
        loadChildren: () =>
            import('./supervisores/supervisores.module').then(
                m => m.SupervisoresModule
            ),
        canActivate: [AuthGuard],
    },

    // Menu Sistemas
    {
        path: 'concilia-golden-dwh',
        loadChildren: () =>
            import('./concilia-golden-dwh/concilia-golden-dwh.module').then(
                m => m.ConciliaGoldenDwhModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'parte-atraso',
        loadChildren: () =>
            import('./parte-atraso/parte-atraso.module').then(
                m => m.ParteAtrasoModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'clasificador-cnmb',
        loadChildren: () =>
            import('./clasificador-cnmb/clasificador-cnmb.module').then(
                m => m.ClasificadorCnmbModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'concilia-aft',
        loadChildren: () =>
            import('./concilia-aft/concilia-aft.module').then(
                m => m.ConciliaAftModule
            ),
        canActivate: [AuthGuard],
    },

    // Menu Conciliación
    {
        path: 'concilia-interna-dwh',
        loadChildren: () =>
            import('./concilia-interna-dwh/concilia-interna-dwh.module').then(
                m => m.ConciliaInternaDwhModule
            ),
        canActivate: [AuthGuard],
    },

    // Menu Contabilidad
    {
        path: 'clasificador-cuenta',
        loadChildren: () =>
            import('./clasificador-cuenta/clasificador-cuenta.module').then(
                m => m.ClasificadorCuentaModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'epigrafes',
        loadChildren: () =>
            import('./epigrafes/epigrafes.module').then(m => m.EpigrafesModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'elementos-gastos',
        loadChildren: () =>
            import('./elementos-gastos/elementos-gastos.module').then(
                m => m.ElementosGastosModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'tipo-entidades',
        loadChildren: () =>
            import('./tipo-entidades/tipo-entidades.module').then(
                m => m.TipoEntidadesModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'clasificador-entidades',
        loadChildren: () =>
            import(
                './clasificador-entidades/clasificador-entidades.module'
            ).then(m => m.ClasificadorEntidadesModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'concilia-contabilidad',
        loadChildren: () =>
            import('./concilia-contabilidad/concilia-contabilidad.module').then(
                m => m.ConciliaContabilidadModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'expresiones',
        loadChildren: () =>
            import('./expresiones/expresiones.module').then(
                m => m.ExpresionesModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'comparar-expresiones',
        loadChildren: () =>
            import('./comparar-expresiones/comparar-expresiones.module').then(
                m => m.CompararExpresionesModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'comparar-valores',
        loadChildren: () =>
            import('./comparar-valores/comparar-valores.module').then(
                m => m.CompararValoresModule
            ),
        canActivate: [AuthGuard],
    },
    {
        path: 'cuentas-no-permitidas',
        loadChildren: () =>
            import('./cuentas-no-permitidas/cuentas-no-permitidas.module').then(
                m => m.CuentasNoPermitidasModule
            ),
        canActivate: [AuthGuard],
    },

    // Cuando no se encuentra el path
    { path: '**', component: StartComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
