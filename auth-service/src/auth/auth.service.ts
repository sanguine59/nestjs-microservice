import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto'

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

@Injectable()
export class AuthService { 
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async register (data: UserData) {
        if(!this.validateRegister(data)) throw new BadRequestException("Bad Credentials")
        
        const isUnique = await this.prisma.user.findUnique({
            where: {email: data.email} 
        })
        if(isUnique) throw new ConflictException("Email Already Registered")
        
        const salt = crypto
            .createHash('sha256')
            .update(data.password)
            .digest('base64');
        

        await this.prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                country: data.country,
                password: salt,
                role: 'USER',
                
            },
        })

        return { status: 200, message: 'User Registered'}
    }


    private validateRegister(data: UserData): Boolean{
        // ga dikasi tau inklusif atau eksklusif
        if(data.username.length < 4 || data.username.length > 40) return false
        if(data.email.split('@').length -1 !== 1) return false
        if(!data.email.includes('.')) return false
        if(data.password.length < 8 || data.password.length > 40) return false
        let hasUpper = false;
        let hasLower = false;
        let hasNumber = false;
        let hasSpecial = false;
        const specialChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";

        for (const char of data.password) {
            if (char >= 'A' && char <= 'Z') hasUpper = true;
            else if (char >= 'a' && char <= 'z') hasLower = true;
            else if (char >= '0' && char <= '9') hasNumber = true;
            else if (specialChars.includes(char)) hasSpecial = true;
        }

        if (!hasLower) return false
        if (!hasUpper) return false
        if (!hasNumber) return false
        if (!hasSpecial) return false
        
        return true
    }

    async login (data: LoginData) {
        const flag = await this.prisma.user.findUnique({
            where: {email: data.email}
        })
        if(!flag) throw new UnauthorizedException("Invalid Credentials")

        const salt = crypto
            .createHash('sha256')
            .update(data.password)
            .digest('base64');
        
        if(salt !== flag.password) throw new UnauthorizedException('Invalid Credentials')        

        const payload = {
            client: flag.user_id,
            role: flag.role
        }
        
        return {status: 200, access_token: await this.jwtService.signAsync(payload) ,message: 'login successful'}
    }

    async getInfo(id: string): Promise<UserProfileData>{
        const flag = await this.prisma.user.findUnique({
            where: {user_id: id},
            select: {
                username: true,
                email: true,
                country: true,
                role: true
            }
        })
        if(!flag) throw new NotFoundException("ID NOT FOUND")
        
        const data: UserProfileData = {
            username: flag.username,
            email: flag.email,
            country: flag.country,
            role: flag.role
        }

        return data
    }
}
