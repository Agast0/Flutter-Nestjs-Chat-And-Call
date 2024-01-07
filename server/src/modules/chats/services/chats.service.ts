import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DatabaseService } from '../../../database/services/database.service';
import { WsException } from '@nestjs/websockets';
import { ErrCallback } from '../../../common/types/ErrCallback.type';
import { User } from '../../../common/types/User.type';
import {
  addUserToDatabase,
  disconnectClient,
  removeUserFromDatabase,
  validateUsername,
} from '../helpers/chats.connection.helper';

@Injectable()
export class ChatsService {
  constructor(private dbService: DatabaseService) {}

  handleConnection(client: Socket, socket: Server) {
    if (!validateUsername(client)) {
      disconnectClient(client, 'ChatsGateway');
      return;
    }

    Logger.log(
      `${client.handshake.query.username}: ${client.id} connected!`,
      `ChatsGateway`,
    );

    addUserToDatabase(client, socket, this.dbService);
  }

  handleDisconnect(client: Socket, socket: Server) {
    Logger.log(
      `${client.handshake.query.username}: ${client.id} disconnected!`,
      `ChatsGateway`,
    );
    removeUserFromDatabase(client, socket, this.dbService);
  }

  handleMessage(
    client: Socket,
    socket: Server,
    body: {
      message: string;
      recipientUsername: string;
      errCallback: ErrCallback;
    },
  ) {
    const clientUsername = client.handshake.query.username;

    if (!body.recipientUsername) {
      Logger.log(
        `${clientUsername}: Message has no recipient`,
        'ERROR ChatsGateway',
      );
      body.errCallback(new WsException('Message must have a recipient'));
      throw new WsException('Message must have a recipient');
    } else if (!body.message) {
      Logger.log(
        `${clientUsername}: Message has no body`,
        'ERROR ChatsGateway',
      );
      body.errCallback(new WsException('Message must have a message'));
      throw new WsException('Message must have a message');
    } else {
      const recipient = this.dbService.getUser(body.recipientUsername);
      if (recipient instanceof Error) {
        Logger.log(
          `${clientUsername}: Message to ${body.recipientUsername} failed. Recipient does not exist`,
          'ERROR ChatsGateway',
        );
        body.errCallback(new WsException(recipient.message));
        throw new WsException(recipient.message);
      } else {
        Logger.log(
          `${clientUsername}: Message to ${body.recipientUsername} succeeded`,
          'ChatsGateway',
        );
        socket.to(recipient.socketId).emit('message', {
          message: body.message,
          senderUsername: clientUsername,
        });
      }
    }
  }

  handleGetOtherUser(client: Socket) {
    return new Promise<User>((resolve, reject) => {
      const otherUser = this.dbService.getOtherUser(
        client.handshake.query.username,
      );
      if (otherUser instanceof Error) {
        reject(new WsException(otherUser.message));
        throw new WsException(otherUser.message);
      } else {
        resolve(otherUser);
      }
    });
  }
}
