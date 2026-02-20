import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginData } from './dto/login.dto';
import { RegisterData } from './dto/register.dto';
import { JwtGuard } from './jwt.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
// interface UserData {
//     username: string,
//     email: string,
//     country: string, 
//     password: string,
// }

// interface LoginData {
//     email: string,
//     password: string
// }

interface UserProfileData {
    username: string,
    email: string,
    country: string,
    role: string
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}


    @Post('register')
    @ApiOkResponse({description: 'Account Registered'})
    @ApiBadRequestResponse({description: 'Bad Credentials'})
    @ApiConflictResponse({description: 'Email Already Existed'})
    register(@Body() body: RegisterData) {
        return this.authService.register(body)
    }

    @Post('login')
    @ApiOkResponse({description: 'Login Succesful'})
    @ApiUnauthorizedResponse({description: 'Invalid Credentials'})
    login(@Body() body: LoginData) {
        return this.authService.login(body)
    }


    @UseGuards(JwtGuard)
    @Get(':id/profile')
    @ApiBearerAuth()
    @ApiParam({name:'id'})
    @ApiOkResponse({description: 'Data Retrieved'})
    @ApiNotFoundResponse({description: 'Data not Found'})
    getInfo(@Param('id') id: string): Promise<UserProfileData> {
        return this.authService.getInfo(id)
    }
}
