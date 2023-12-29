import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { Catch, Logger } from '@nestjs/common';
import { RoomFullException } from '../RoomFullException';

@Catch(RoomFullException)
export class RoomFullExceptionFilter extends BaseWsExceptionFilter {
  catch(exception, host) {
    Logger.log(exception.message, 'ERROR Room Full');
  }
}