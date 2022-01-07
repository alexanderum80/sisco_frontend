import { MessageService } from 'primeng/api';
import { IActionItemClickedArgs, ActionClicked } from './../../shared/models/list-items';
import { IUsuarioInfo } from './../../shared/models/usuarios';
import { UsuarioFormComponent } from './../usuario-form/usuario-form.component';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../shared/services/usuario.service';
import { UsuariosMutationResponse } from '../shared/models/usuarios.model';
import SweetAlert from 'sweetalert2';
import { QueryRef, Apollo } from 'apollo-angular';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { usuariosApi } from '../shared/graphql/usuarioActions.gql';
import { ModalService } from '../../shared/services/modal.service';
import { UsuariosQueryResponse } from '../shared/models/usuarios.model';
import { ITableColumns } from 'src/app/shared/ui/prime-ng/table/table.model';
import { cloneDeep } from '@apollo/client/utilities';
import { isArray } from 'lodash';

@Component({
  selector: 'app-usuarios',
  templateUrl: './list-usuarios.component.html',
  styleUrls: ['./list-usuarios.component.scss']
})
export class ListUsuariosComponent implements OnInit, AfterViewInit, OnDestroy {
  listUsuarioQuery: QueryRef<UsuariosQueryResponse>;

  columns: ITableColumns[] = [
    { header: 'Usuario', field: 'Usuario', type: 'string' },
    { header: 'Tipo de Usuario', field: 'TipoUsuario.TipoUsuario', type: 'string' },
    { header: 'División', field: 'Division.Division', type: 'string' },
  ];

  usuarios: IUsuarioInfo[] = [];

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
    private _modalSvc: ModalService,
    private _usuarioSvc: UsuarioService,
    private _msgSvc: MessageService
  ) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this._getUsuarios();
  }

  ngOnDestroy(): void {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  hasAdminPermission(): boolean {
    return this._usuarioSvc.hasAdminPermission();
  }

  private _getUsuarios(): void {
    try {
      this.subscription.push(this._apollo.watchQuery<UsuariosQueryResponse>({
          query: usuariosApi.all,
          fetchPolicy: 'network-only'
        }).valueChanges.subscribe(({data}) => {
          const result = data.getAllUsuarios;

          if (result.success === false) {
            return SweetAlert.fire({
              icon: 'error',
              title: 'ERROR',
              text: `Ocurrió el siguiente error: ${ result.error }`,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar'
            });
          }

          this.usuarios = cloneDeep(result.data);
      }));
    } catch (err: any) {
      SweetAlert.fire({
        icon: 'error',
        title: 'ERROR',
        text: `Ha ocurrido el siguiente error: ${ err }`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  actionClicked(event: IActionItemClickedArgs) {
    switch (event.action) {
      case ActionClicked.Add:
        this._add();
        break;
      case ActionClicked.Edit:
        this._edit(event.item)
        break;    
      case ActionClicked.Delete:
        this._delete(event.item)
        break;
    }
  }

  private _add(): void {
    if (this.hasAdminPermission()) {
      const inputData = {
        idUsuario: null,
        usuario: '',
        contrasena: '',
        tipoUsuario: null,
        cambiarContrasena: false,
        contrasenaAvanzada: '',
        idDivision: this._usuarioSvc.usuario.Division.IdDivision
      };
      this._usuarioSvc.fg.patchValue(inputData);
      
      this._modalSvc.openModal('Agregar Usuario', UsuarioFormComponent);
      this._modalSvc.ref.onClose.subscribe((message: string) => {
        if (message) {
            this._msgSvc.add({ severity: 'success', summary: 'Satisfactorio', detail: message })
        }
      });
    }
  }

  private _edit(data: any): void {
    if (this.hasAdminPermission()) {
      const idUsuario = data.IdUsuario;

      this.subscription.push(this._apollo.query<UsuariosQueryResponse>({
        query: usuariosApi.byId,
        variables: { id: idUsuario },
        fetchPolicy: 'network-only'
      }).subscribe(response => {
        const result = response.data.getUsuarioById;

        if (!result.success) {
          return SweetAlert.fire({
            icon: 'error',
            title: 'ERROR',
            text: `Se produjo el siguiente error: ${ result.error }`,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar'
          });
        }

        const selectedUsuario = result.data;

        const inputData = {
          idUsuario: selectedUsuario.IdUsuario,
          usuario: selectedUsuario.Usuario,
          contrasena: '',
          tipoUsuario: selectedUsuario.TipoUsuario.IdTipo,
          contrasenaAvanzada: '',
          idDivision: selectedUsuario.Division.IdDivision,
        };

        this._usuarioSvc.fg.patchValue(inputData);

        this._modalSvc.openModal('Modificar Usuario', UsuarioFormComponent);
        this._modalSvc.ref.onClose.subscribe((message: string) => {
          if (message) {
              this._msgSvc.add({ severity: 'success', summary: 'Satisfactorio', detail: message })
          }
        });      
      }));
    }
  }

  private _delete(data: any): void {
    if (this.hasAdminPermission()) {
      SweetAlert.fire({
        icon: 'question',
        title: '¿Desea Eliminar el(los) Usuario(s) seleccionado(s)?',
        text: 'No se podrán deshacer los cambios.',
        showConfirmButton: true,
        confirmButtonText: 'Sí',
        showCancelButton: true,
        cancelButtonText: 'No'
      }).then(res => {
        if (res.value) {
          const IDsToRemove: number[] = !isArray(data) ? [data.IdUsuario] :  data.map(d => { return d.IdUsuario });

          // const IDsToRemove = [idUsuario];

          this.subscription.push(this._apollo.mutate<UsuariosMutationResponse>({
            mutation: usuariosApi.delete,
            variables: { IDs: IDsToRemove },
            refetchQueries: ['GetAllUsuarios']
          }).subscribe(response => {
            const result = response.data?.deleteUsuario;

            if (result?.success === false) {
              return SweetAlert.fire({
                icon: 'error',
                title: 'ERROR',
                text: `Ocurrió el siguiente error: ${ result?.error }`,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar'
              });
            }

            this._msgSvc.add({ severity: 'success', summary: 'Satisfactorio', detail: 'El Usuario se ha eliminado correctamente.' })
          }));
        }
      });
    }
  }

}
