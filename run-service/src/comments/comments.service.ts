import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientsService } from '../clients/clients.service';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private clients: ClientsService,
  ) {}

  async create(authedUserId: string, data: CreateCommentDto) {
    if (data.user_id !== authedUserId) {
      throw new ForbiddenException('user id must match authenticated user');
    }

    const run = await this.prisma.run.findUnique({ where: { run_id: data.run_id } });
    if (!run) throw new BadRequestException('run id must exist');

    const user = await this.clients.getUserProfile(data.user_id);
    if (!user) throw new BadRequestException('user id must exist');

    await this.prisma.comment.create({
      data: {
        run_id: data.run_id,
        user_id: data.user_id,
        comment: data.comment,
      },
    });
    return { status: 200, message: 'Comment created' };
  }

  async remove(authedUserId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { comment_id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user_id !== authedUserId) {
      throw new ForbiddenException('You are not the owner of this comment');
    }
    await this.prisma.comment.delete({ where: { comment_id: commentId } });
    return { status: 200, message: 'Comment deleted' };
  }
}
