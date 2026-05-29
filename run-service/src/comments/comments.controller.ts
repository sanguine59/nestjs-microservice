import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';
import { JwtGuard } from '../auth/jwt.guard';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Comment created' })
  create(@Body() body: CreateCommentDto, @Req() req: any) {
    return this.comments.create(req.user.id, body);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Comment deleted' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.comments.remove(req.user.id, id);
  }
}
