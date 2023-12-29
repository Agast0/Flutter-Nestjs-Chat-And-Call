import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DatabaseService } from '../../../database/services/database.service';
import { WsException } from '@nestjs/websockets';
import { CallbackUserArg } from '../../../common/types/CallbackUserArg.type';
import { ErrCallback } from '../../../common/types/ErrCallback.type';

@Injectable()
export class ChatsService {
  constructor(private dbService: DatabaseService) {}

  handleConnection(client: Socket) {
    if (!client.handshake.headers.username) {
      Logger.log(
        `${client.id} connected without username, Disconnecting!`,
        'ChatsGateway',
      );
      client.disconnect();
    } else {
      Logger.log(
        `${client.handshake.headers.username}: ${client.id} connected!`,
        `ChatsGateway`,
      );
      const error = this.dbService.addUser({
        username: client.handshake.headers.username,
        socketId: client.id,
      });
      if (error) {
        Logger.log(error.message, 'ERROR | ChatsGateway');
        client.disconnect();
      }
    }
  }

  handleDisconnect(client: Socket) {
    Logger.log(
      `${client.handshake.headers.username}: ${client.id} disconnected!`,
      `ChatsGateway`,
    );
    const error = this.dbService.removeUser(client.handshake.headers.username);
    if (error) {
      Logger.log(error.message, 'ERROR | ChatsGateway');
    }
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
    const clientUsername = client.handshake.headers.username;

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

  handleGetOtherUser(
    client: Socket,
    socket: Server,
    body: { errCallback: ErrCallback; callback: CallbackUserArg },
  ) {
    const otherUser = this.dbService.getOtherUser(
      client.handshake.headers.username,
    );
    if (otherUser instanceof Error) {
      body.errCallback(new WsException(otherUser.message));
      throw new WsException(otherUser.message);
    } else {
      body.callback(otherUser);
    }
  }
}
