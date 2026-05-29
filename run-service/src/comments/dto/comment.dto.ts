import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'run id must be filled' })
  run_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'user id must be filled' })
  user_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'comment must be filled' })
  comment: string;
}
