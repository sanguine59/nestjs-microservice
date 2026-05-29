import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto, UpdateGameDto } from './dto/game.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.game.findMany();
  }

  async findOne(id: string) {
    const game = await this.prisma.game.findUnique({
      where: { game_id: id },
      include: { categories: true },
    });
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async create(data: CreateGameDto) {
    if (!data.game_name || !data.description) {
      throw new BadRequestException('game name and description must be filled');
    }
    await this.prisma.game.create({
      data: {
        game_name: data.game_name,
        description: data.description,
      },
    });
    return { status: 200, message: 'Game created' };
  }

  async update(id: string, data: UpdateGameDto) {
    const exists = await this.prisma.game.findUnique({ where: { game_id: id } });
    if (!exists) throw new NotFoundException('Game not found');

    await this.prisma.game.update({
      where: { game_id: id },
      data: {
        ...(data.game_name !== undefined && { game_name: data.game_name }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
    return { status: 200, message: 'Game updated' };
  }

  async remove(id: string) {
    const exists = await this.prisma.game.findUnique({ where: { game_id: id } });
    if (!exists) throw new NotFoundException('Game not found');

    await this.prisma.game.delete({ where: { game_id: id } });
    return { status: 200, message: 'Game deleted' };
  }
}
