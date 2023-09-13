import { UsuariosQueryResponse } from './../../../../usuarios/shared/models/usuarios.model';
import { AuthenticationService } from './../../../../shared/services/authentication.service';
import { usuariosApi } from './../../../../usuarios/shared/graphql/usuarioActions.gql';
import { SocketService } from './../../../../shared/services/socket.service';
import { IUsuario } from 'src/app/shared/models';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { IUsuariosChat } from './chat.model';
import { Injectable } from '@angular/core';
import { startCase, sortBy, orderBy } from 'lodash';

@Injectable()
export class ChatService {
  userInfo: IUsuario;
  usuariosList: IUsuariosChat[] = [];

  subscription: Subscription[] = [];

  constructor(
    private _apollo: Apollo,
    private _authSvc: AuthenticationService,
    private _socketSvc: SocketService
  ) {
    this.userInfo = _authSvc.usuario;

    this.subscription.push(
      _socketSvc.newConnection$.subscribe(() => {
        this.connectCurrentUser();
      })
    );

    this.subscription.push(
      _socketSvc.connectedUser$.subscribe(value => {
        this.switchUsuarioConectado(value.idUsuario, value.estado);
      })
    );
  }

  getUsuarios() {
    this.subscription.push(
      this._apollo
        .query<UsuariosQueryResponse>({
          query: usuariosApi.all,
        })
        .subscribe(res => {
          const usuarios = [
            ...sortBy(res.data.getAllUsuarios.data, [
              'Division.IdDivision',
              'Usuario',
            ]),
          ];
          this.usuariosList = usuarios
            .filter(f => f.IdUsuario !== this.userInfo.IdUsuario)
            .map(u => {
              return {
                IdDivision: u.Division.IdDivision.toString(),
                IdUsuario: u.IdUsuario?.toString(),
                Usuario:
                  startCase(u.Usuario) + ' (' + u.Division.IdDivision + ')',
                Conectado: false,
              };
            });

          this.connectCurrentUser();
        })
    );
  }

  connectCurrentUser() {
    this._socketSvc.emitSocket('connect-user', this.userInfo.IdUsuario);
  }

  disconnectCurrentUser() {
    this._socketSvc.emitSocket('disconnect-user', this.userInfo.IdUsuario);
  }

  switchUsuarioConectado(idUsuario: number, estado: boolean) {
    const userIndex = this.usuariosList.findIndex(
      u => u.IdUsuario === idUsuario.toString()
    );
    if (userIndex !== -1) {
      this.usuariosList[userIndex].Conectado = estado;
    }

    this.usuariosList = orderBy(
      this.usuariosList,
      ['Conectado', 'IdDivision', 'Usuario'],
      ['desc', 'asc', 'asc']
    );
  }

  sendMessage(message: string) {
    if (message && message.replace(/ /g, '') !== '') {
      this._socketSvc.emitSocket('new-message', {
        idUser: this.userInfo.IdUsuario,
        user:
          startCase(this.userInfo.Usuario) +
          ' (' +
          this.userInfo.IdDivision +
          ')',
        text: message,
      });
    }
  }
}
