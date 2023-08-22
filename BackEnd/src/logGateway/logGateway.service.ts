import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway(4001, { origin: '*', cors: true })
export class LogGatewayService {
  @WebSocketServer()
  server: Server;

  handleEvent(event: string, log: any) {
    this.server.emit(event, log);
  }
}
