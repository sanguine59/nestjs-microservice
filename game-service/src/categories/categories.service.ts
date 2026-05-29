import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const cat = await this.prisma.runCategory.findUnique({
      where: { run_category_id: id },
      include: { game: true },
    });
    if (!cat) throw new NotFoundException('Run category not found');
    return cat;
  }

  async create(data: CreateCategoryDto) {
    if (!data.run_category_name) {
      throw new BadRequestException('run category name must be filled');
    }
    const game = await this.prisma.game.findUnique({ where: { game_id: data.game_id } });
    if (!game) throw new BadRequestException('game id must exist');

    await this.prisma.runCategory.create({
      data: {
        game_id: data.game_id,
        run_category_name: data.run_category_name,
      },
    });
    return { status: 200, message: 'Run category created' };
  }

  async update(id: string, data: UpdateCategoryDto) {
    const exists = await this.prisma.runCategory.findUnique({ where: { run_category_id: id } });
    if (!exists) throw new NotFoundException('Run category not found');

    if (data.game_id) {
      const game = await this.prisma.game.findUnique({ where: { game_id: data.game_id } });
      if (!game) throw new BadRequestException('game id must exist');
    }

    await this.prisma.runCategory.update({
      where: { run_category_id: id },
      data: {
        ...(data.game_id !== undefined && { game_id: data.game_id }),
        ...(data.run_category_name !== undefined && { run_category_name: data.run_category_name }),
      },
    });
    return { status: 200, message: 'Run category updated' };
  }

  async remove(id: string) {
    const exists = await this.prisma.runCategory.findUnique({ where: { run_category_id: id } });
    if (!exists) throw new NotFoundException('Run category not found');

    await this.prisma.runCategory.delete({ where: { run_category_id: id } });
    return { status: 200, message: 'Run category deleted' };
  }
}
