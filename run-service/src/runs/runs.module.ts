import { Module } from '@nestjs/common';
import { RunsController } from './runs.controller';
import { RunsService } from './runs.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [PrismaModule, AuthModule, ClientsModule],
  controllers: [RunsController],
  providers: [RunsService],
})
export class RunsModule {}
