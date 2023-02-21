import { SocketService } from './../../../../shared/services/socket.service';
import { ChatService } from './chat.service';
import { IChat } from './chat.model';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @Output() OnToggle = new EventEmitter<boolean>();

  message: string;
  emergenteMessage: IChat = {
    idUser: 0,
    user: '',
    text: '',
  };
  messages: IChat[] = [];

  toggled = true;
  showEmergente = false;

  constructor(public chatSvc: ChatService, private _socketSvc: SocketService) {}

  ngOnInit() {
    this.chatSvc.getUsuarios();

    this._socketSvc.getMessage().subscribe((message: IChat) => {
      this.messages.push(message);

      this.showEmergente = false;
      this._showEmergenteMessage(message);
      this._reproducirSonidoMensaje();
    });
  }

  ngOnDestroy() {
    this.chatSvc.disconnectCurrentUser();
    this.chatSvc.subscription.forEach(subsc => subsc.unsubscribe);
  }

  private _reproducirSonidoMensaje() {
    const audio = new Audio('assets/sounds/tono_mensajes.mp3');
    audio.play();
  }

  sendMessage() {
    this.chatSvc.sendMessage(this.message);
    this.message = '';
  }

  switchToogle() {
    this.toggled = !this.toggled;
    this.OnToggle.emit(this.toggled);
  }

  private _showEmergenteMessage(message: IChat) {
    if (this.toggled) {
      this.emergenteMessage = message;
      this.showEmergente = true;

      setTimeout(() => {
        this.showEmergente = false;
      }, 5000);
    }
  }

  openChat() {
    this.showEmergente = false;
    this.switchToogle();
  }

  get currentUser() {
    return this.chatSvc.userInfo.IdUsuario;
  }
}
