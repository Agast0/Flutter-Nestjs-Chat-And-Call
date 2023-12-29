import { Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

export class RoomFullException extends WsException {
  constructor(message) {
    super(message)
  }
}