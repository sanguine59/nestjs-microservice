import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRunDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'run category id must be filled' })
  run_category_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'vod url must be filled' })
  vod_url: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt({ message: 'run duration must be a number' })
  @Min(0)
  run_duration: number;
}
