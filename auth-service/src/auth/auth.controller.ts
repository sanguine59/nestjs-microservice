import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

interface UserData {
    username: string,
    email: string,
    country: string, 
    password: string,
}

interface LoginData {
    email: string,
    password: string
}

interface UserProfileData {
    username: string,
    email: string,
    country: string,
    role: string
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @Post('register')
    register(@Body() body: UserData) {
        return this.authService.register(body)
    }

    @Post('login')
    login(@Body() body: LoginData) {
        return this.authService.login(body)
    }

    @Get(':id/profile')
    getInfo(@Param('id') id: string): Promise<UserProfileData> {
        return this.authService.getInfo(id)
    }
}
