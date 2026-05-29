import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsService } from './clients.service';

@Module({
  imports: [ConfigModule],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
