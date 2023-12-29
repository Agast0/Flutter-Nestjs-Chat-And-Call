import { Module } from '@nestjs/common';
import { ChatsService } from './services/chats.service';
import { DatabaseModule } from '../../database/database.module';
import { ChatsGateway } from './gateways/chats.gateway';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [ChatsService, ChatsGateway],
})
export class ChatsModule {}
