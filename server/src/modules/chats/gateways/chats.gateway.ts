import {
  MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WsException,
} from '@nestjs/websockets';
import { ChatsService } from '../services/chats.service';
import { DatabaseService } from '../../../database/services/database.service';
import { Logger, UseFilters } from '@nestjs/common';
import { Socket } from 'socket.io';

@WebSocketGateway(3001) // I have problems with 3000 for some reason
export class ChatsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatsService: ChatsService, private dbService: DatabaseService) {}

  afterInit() {
    Logger.log('ChatsGateway Initialized!', 'ChatsGateway');
  }


  handleConnection(client: Socket) {
    if (!client.handshake.headers.username) {
      Logger.log(`${client.id} connected without username, Disconnecting!`, 'ChatsGateway');
      client.disconnect();
    } else {
      Logger.log(`${client.handshake.headers.username}: ${client.id} connected!`, `ChatsGateway`);

      this.dbService.addUser({ username: client.handshake.headers.username, socketId: client.id });
    }
  }

  handleDisconnect(client: Socket) {
    Logger.log(`${client.handshake.headers.username}: ${client.id} disconnected!`, `ChatsGateway`);
    this.dbService.removeUser(client.handshake.headers.username);
  }

  @SubscribeMessage('test')
  onTest(@MessageBody() body: any) {
    console.log(this.dbService.getNumberOfUsers())
  }
}
