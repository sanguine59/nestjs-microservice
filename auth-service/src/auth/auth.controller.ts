import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginData } from './dto/login.dto';
import { RegisterData } from './dto/register.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

interface UserProfileData {
  username: string;
  email: string;
  country: string;
  role: string;
}

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register')
  @ApiOkResponse({ description: 'Account Registered' })
  @ApiBadRequestResponse({ description: 'Bad Credentials' })
  @ApiConflictResponse({ description: 'Email Already Existed' })
  register(@Body() body: RegisterData) {
    return this.authService.register(body);
  }

  @Post('auth/login')
  @ApiOkResponse({ description: 'Login Successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  login(@Body() body: LoginData) {
    return this.authService.login(body);
  }

  @Get('users/:id/profile')
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'Data Retrieved' })
  @ApiNotFoundResponse({ description: 'Data not Found' })
  getInfo(@Param('id') id: string): Promise<UserProfileData> {
    return this.authService.getInfo(id);
  }
}
