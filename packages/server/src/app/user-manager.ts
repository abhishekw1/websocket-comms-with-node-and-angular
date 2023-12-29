import { WebSocket } from 'ws';
import {
  ChatMessage,
  ChatRealyMessgae,
  LoginMessage,
  SystemNotice,
  User,
  WsMessgae,
  UserListMessage,
} from '@websocket/types';
import { IncomingMessage } from 'http';
let currId = 1;
export class UserManager {
  private sockets = new Map<WebSocket, User>();

  add(socket: WebSocket, request: IncomingMessage) {
    //localhost:8080/?name=Jane
    const fullUrl = new URL(request.headers.host + request.url);
    const name = fullUrl.searchParams.get('name');
    const user: User = {
      name: name,
      id: currId++,
    };
    const systemNotice: SystemNotice = {
      event: 'systemNotice',
      contents: `${name} had been joined the chat`,
    };
    this.sendToAll(systemNotice);

    const loginMessage: LoginMessage = {
      user,
      event: 'login',
    };
    socket.send(JSON.stringify(loginMessage));
    this.sockets.set(socket, user);
    this.sendUserListToAll();
  }

  remove(socket: WebSocket) {
    const name = this.sockets.get(socket).name;
    this.sockets.delete(socket);
    const systemNotice: SystemNotice = {
      event: 'systemNotice',
      contents: `${name} had been left the chat`,
    };
    this.sendToAll(systemNotice);
    this.sendUserListToAll();
  }

  send(socket: WebSocket, message: WsMessgae) {
    const data = JSON.stringify(message);
    socket.send(data);
  }
  sendToAll(message: WsMessgae) {
    const data = JSON.stringify(message);
    Array.from(this.sockets.keys()).forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    });
  }

  relayChat(from: WebSocket, chatMsg: ChatMessage) {
    const relayMsg: ChatRealyMessgae = {
      event: 'chatRelay',
      contents: chatMsg.contents,
      author: this.sockets.get(from),
    };
    this.sendToAll(relayMsg);
  }

  sendUserListToAll() {
    const message: UserListMessage = {
      event: 'userList',
      users: Array.from(this.sockets.values()),
    };
    this.sendToAll(message);
  }
}
