import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/services/database.service';

export const validateUsername = (client: Socket): boolean => {
  return !!client.handshake.query.username;
};

export const disconnectClient = (client: Socket, namespace: string) => {
  Logger.log(
    `${client.id} connected without username, Disconnecting!`,
    namespace,
  );
  client.disconnect();
};

export const addUserToDatabase = (
  client: Socket,
  socket: Server,
  dbService: DatabaseService,
): void => {
  const error = dbService.addUser({
    username: client.handshake.query.username,
    socketId: client.id,
  });

  if (error) {
    logErrorAndDisconnectClient(error, client);
    return;
  }

  informOtherUser(client, socket, dbService, 'userConnected');
};

export const logErrorAndDisconnectClient = (error: Error, client: Socket) => {
  Logger.log(error.message, 'ERROR | ChatsGateway');
  client.disconnect();
};

export const informOtherUser = (
  client: Socket,
  socket: Server,
  dbService: DatabaseService,
  event: string,
) => {
  const otherUser = dbService.getOtherUser(client.handshake.query.username);

  if (otherUser instanceof Error) {
    Logger.log(
      otherUser.message,
      'ERROR - no other user to inform | ChatsGateway',
    );
  } else {
    console.log(`emitting ${event} to ${otherUser.socketId}`);
    socket.to(otherUser.socketId).emit(event, {
      username: client.handshake.query.username,
      socketId: client.id,
    });
  }
};

export const removeUserFromDatabase = (
  client: Socket,
  socket: Server,
  dbService: DatabaseService,
) => {
  const error = dbService.removeUser(client.handshake.query.username);
  if (error) {
    Logger.log(error.message, 'ERROR | ChatsGateway');
  }

  informOtherUser(client, socket, dbService, 'userDisconnected');
};
