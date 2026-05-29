import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientsService } from '../clients/clients.service';
import { CreateRunDto } from './dto/run.dto';

const STATUSES = ['PENDING', 'ACCEPTED', 'REJECTED'] as const;

function formatDuration(totalSeconds: bigint | number): string {
  const total = Number(totalSeconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h} Hour(s) ${m} Minute(s) ${s} Second(s)`;
}

@Injectable()
export class RunsService {
  constructor(
    private prisma: PrismaService,
    private clients: ClientsService,
  ) {}

  async listByCategory(categoryId: string) {
    const category = await this.clients.getCategory(categoryId);
    if (!category) throw new NotFoundException('Run category not found');

    const runs = await this.prisma.run.findMany({
      where: { run_category_id: categoryId, status: 'ACCEPTED' },
      orderBy: { run_duration: 'asc' },
    });

    const result = await Promise.all(
      runs.map(async (r) => {
        const runner = await this.clients.getUserProfile(r.user_id);
        return {
          run_id: r.run_id,
          runner: runner ?? { user_id: r.user_id },
          game: category.game ?? null,
          run_category_name: category.run_category_name,
          run_duration: formatDuration(r.run_duration),
          vod_url: r.vod_url,
        };
      }),
    );
    return result;
  }

  async listByUser(targetUserId: string, authedUserId: string) {
    const where: any = { user_id: targetUserId };
    if (targetUserId !== authedUserId) where.status = 'ACCEPTED';

    const runs = await this.prisma.run.findMany({
      where,
      orderBy: { submitted_at: 'desc' },
    });
    return runs.map((r) => ({
      ...r,
      run_duration: Number(r.run_duration),
    }));
  }

  async findOne(id: string) {
    const run = await this.prisma.run.findUnique({
      where: { run_id: id },
      include: { comments: true },
    });
    if (!run) throw new NotFoundException('Run not found');

    const [runner, category] = await Promise.all([
      this.clients.getUserProfile(run.user_id),
      this.clients.getCategory(run.run_category_id),
    ]);

    return {
      run_id: run.run_id,
      runner: runner ?? { user_id: run.user_id },
      run_category_name: category?.run_category_name ?? null,
      game: category?.game ?? null,
      vod_url: run.vod_url,
      run_duration: formatDuration(run.run_duration),
      status: run.status,
      submitted_at: run.submitted_at,
      verified_at: run.verified_at,
      comments: run.comments,
    };
  }

  async create(userId: string, data: CreateRunDto) {
    const category = await this.clients.getCategory(data.run_category_id);
    if (!category) throw new BadRequestException('run category id must exist');
    if (!data.vod_url) throw new BadRequestException('vod url must be filled');
    if (typeof data.run_duration !== 'number' || Number.isNaN(data.run_duration)) {
      throw new BadRequestException('run duration must be a number');
    }

    await this.prisma.run.create({
      data: {
        run_category_id: data.run_category_id,
        user_id: userId,
        vod_url: data.vod_url,
        run_duration: BigInt(Math.trunc(data.run_duration)),
        status: 'PENDING',
      },
    });
    return { status: 200, message: 'Run submitted' };
  }

  async listByStatus(status: string) {
    const upper = status.toUpperCase();
    if (!STATUSES.includes(upper as any)) {
      throw new BadRequestException('Invalid status');
    }
    const runs = await this.prisma.run.findMany({
      where: { status: upper },
      orderBy: { submitted_at: 'desc' },
    });
    return runs.map((r) => ({ ...r, run_duration: Number(r.run_duration) }));
  }

  async accept(id: string) {
    const run = await this.prisma.run.findUnique({ where: { run_id: id } });
    if (!run) throw new NotFoundException('Run not found');
    await this.prisma.run.update({
      where: { run_id: id },
      data: { status: 'ACCEPTED', verified_at: new Date() },
    });
    return { status: 200, message: 'Run accepted' };
  }

  async reject(id: string) {
    const run = await this.prisma.run.findUnique({ where: { run_id: id } });
    if (!run) throw new NotFoundException('Run not found');
    await this.prisma.run.update({
      where: { run_id: id },
      data: { status: 'REJECTED', verified_at: new Date() },
    });
    return { status: 200, message: 'Run rejected' };
  }
}
