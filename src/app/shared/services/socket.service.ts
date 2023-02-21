import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';

interface IConnectedUser {
  idUsuario: number;
  estado: boolean;
}

@Injectable()
export class SocketService {
  private _newConnectionSubject = new BehaviorSubject<boolean>(false);
  private _connectedUserSubject = new BehaviorSubject<IConnectedUser>({
    idUsuario: 0,
    estado: false,
  });
  private _conciliaStatusSubject = new BehaviorSubject<string>('');

  constructor(private _socket: Socket) {
    this._watchEvents();
  }

  private _watchEvents() {
    this._socket.on('new-connection', () => {
      setTimeout(() => {
        this._newConnectionSubject.next(true);
      }, 2000);
    });

    this._socket.on('connected-user', (idUsuario: number) => {
      const connectedUser: IConnectedUser = {
        idUsuario: idUsuario,
        estado: true,
      };
      this._connectedUserSubject.next(connectedUser);
    });

    this._socket.on('disconnected-user', (idUsuario: number) => {
      const connectedUser: IConnectedUser = {
        idUsuario: idUsuario,
        estado: false,
      };
      this._connectedUserSubject.next(connectedUser);
    });

    this._socket.on('concilia-status', (status: string) => {
      this._conciliaStatusSubject.next(status);
    });
  }

  emitSocket(event: any, variables: any) {
    this._socket.emit(event, variables);
  }

  getMessage() {
    return this._socket.fromEvent('new-message') as any;
  }

  get newConnection$(): Observable<boolean> {
    return this._newConnectionSubject.asObservable();
  }

  get connectedUser$(): Observable<IConnectedUser> {
    return this._connectedUserSubject.asObservable();
  }

  get conciliaStatus$(): Observable<string> {
    return this._conciliaStatusSubject.asObservable();
  }
}
