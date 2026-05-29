import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [PrismaModule, AuthModule, ClientsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
