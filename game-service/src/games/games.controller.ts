import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { CreateGameDto, UpdateGameDto } from './dto/game.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Games')
@Controller()
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('games')
  @ApiOkResponse({ description: 'List of all games' })
  findAll() {
    return this.gamesService.findAll();
  }

  @Get('games/:id')
  @ApiOkResponse({ description: 'Game details with run categories' })
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Post('admin/games')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Game created' })
  create(@Body() body: CreateGameDto) {
    return this.gamesService.create(body);
  }

  @Patch('admin/games/:id/update')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Game updated' })
  update(@Param('id') id: string, @Body() body: UpdateGameDto) {
    return this.gamesService.update(id, body);
  }

  @Delete('admin/games/:id/delete')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Game deleted' })
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }
}
