import { Injectable } from '@angular/core';
import {
  ChatMessage,
  ChatRealyMessgae,
  SystemNotice,
  User,
  WsMessgae,
} from '@websocket/types';
import { BehaviorSubject, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({ providedIn: 'root' })
export class AppService {
  user$ = new BehaviorSubject<User>(undefined);
  socket: WebSocketSubject<WsMessgae>;
  chatMessgae$ = new Subject<ChatRealyMessgae>();
  systemNotices$ = new Subject<SystemNotice>();
  userList$ = new BehaviorSubject<User[]>(undefined);

  connect(name: string) {
    this.socket = webSocket(`ws://localhost:8080/?name=${name}`);
    this.socket.subscribe((message) => this.onMessageFromServer(message));
  }

  send(contents: string) {
    const chatMsg: ChatMessage = {
      event: 'chat',
      contents,
    };
    this.socket.next(chatMsg);
  }
  onMessageFromServer(message: WsMessgae) {
    console.log(message);
    switch (message.event) {
      case 'login':
        this.user$.next(message.user);
        break;
      case 'chatRelay':
        this.chatMessgae$.next(message);
        break;
      case 'systemNotice':
        this.systemNotices$.next(message);
        break;
      case 'userList':
        this.userList$.next(message.users);
        break;
    }
  }
}
