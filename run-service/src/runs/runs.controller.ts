import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RunsService } from './runs.service';
import { CreateRunDto } from './dto/run.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Runs')
@Controller()
export class RunsController {
  constructor(private readonly runs: RunsService) {}

  @Get('runs/:id/category')
  @ApiOkResponse({ description: 'List of accepted runs in a category' })
  listByCategory(@Param('id') id: string) {
    return this.runs.listByCategory(id);
  }

  @Get('runs/:id/user')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'List of runs by user' })
  listByUser(@Param('id') id: string, @Req() req: any) {
    return this.runs.listByUser(id, req.user.id);
  }

  @Get('runs/:id')
  @ApiOkResponse({ description: 'Run details' })
  findOne(@Param('id') id: string) {
    return this.runs.findOne(id);
  }

  @Post('runs')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Run submitted' })
  create(@Body() body: CreateRunDto, @Req() req: any) {
    return this.runs.create(req.user.id, body);
  }

  @Get('admin/runs/:status')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Runs by status' })
  listByStatus(@Param('status') status: string) {
    return this.runs.listByStatus(status);
  }

  @Post('admin/runs/:id/accept')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Run accepted' })
  accept(@Param('id') id: string) {
    return this.runs.accept(id);
  }

  @Post('admin/runs/:id/reject')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Run rejected' })
  reject(@Param('id') id: string) {
    return this.runs.reject(id);
  }
}
