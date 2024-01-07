import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatsService } from '../services/chats.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ErrCallback } from '../../../common/types/ErrCallback.type';

@WebSocketGateway(3001, { namespace: 'chats' }) // I have problems with 3000 for some reason
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private chatsService: ChatsService) {}

  @WebSocketServer()
  socket: Server;

  afterInit() {
    Logger.log('ChatsGateway Initialized!', 'ChatsGateway');
  }

  handleConnection(client: Socket) {
    this.chatsService.handleConnection(client, this.socket);
  }

  handleDisconnect(client: Socket) {
    this.chatsService.handleDisconnect(client, this.socket);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body: {
      message: string;
      recipientUsername: string;
      errCallback: ErrCallback;
    },
  ) {
    this.chatsService.handleMessage(client, this.socket, body);
  }

  @SubscribeMessage('getOtherUser')
  async handleGetOtherUser(@ConnectedSocket() client: Socket) {
    return await this.chatsService.handleGetOtherUser(client);
  }
}
