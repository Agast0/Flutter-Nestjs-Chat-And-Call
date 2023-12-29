import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './services/database.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
