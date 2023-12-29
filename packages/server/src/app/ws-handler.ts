import { IncomingMessage } from 'http';
import { WebSocket, WebSocketServer, ServerOptions, RawData } from 'ws';
import { UserManager } from './user-manager';

export class WsHandler {
  private weServer: WebSocketServer;
  private userManager: UserManager;

  initialize(options: ServerOptions) {
    this.weServer = new WebSocketServer(options);
    this.userManager = new UserManager();
    this.weServer.on('listening', () =>
      console.log(`Server listening on port ${options.port}`)
    );
    this.weServer.on('connection', (socket, request) =>
      this.onSocketConnected(socket, request)
    );
  }

  onSocketConnected(socket: WebSocket, request: IncomingMessage) {
    console.log('New web socket Connection!');
    this.userManager.add(socket, request);
    socket.on('message', (data: RawData) => this.onSocketMessage(socket, data));
    socket.on('close', (code: number, reason) =>
      this.onSocketClosed(socket, code, reason)
    );
  }

  onSocketMessage(socket: WebSocket, data: RawData) {
    const payload = JSON.parse(`${data}`);
    // console.log('Recived', payload);
    // this.userManager.sendToAll(payload);
    switch (payload.event) {
      case 'chat': {
        this.userManager.relayChat(socket, payload);
        break;
      }
    }
  }

  onSocketClosed(socket: WebSocket, code: number, reason) {
    console.log(`Client has disconnected; code=${code} reason=${reason}`);
    this.userManager.remove(socket);
  }
}
