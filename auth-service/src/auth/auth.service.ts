import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'

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

@Injectable()
export class AuthService { 
    constructor(
        private prisma: PrismaService
    ) {}

    async register (data: UserData) {
        if(!this.validateRegister(data)) throw new BadRequestException("Bad Credentials")
        
        const isUnique = await this.prisma.user.findUnique({
            where: {email: data.email} 
        })
        if(isUnique) throw new ConflictException("Email Already Registered")
        
        const salt = await bcrypt.hash(data.password, 10)
        

        await this.prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                country: data.country,
                password: salt,
                role: 'USER',
                
            },
        })

        return { message: 'User Registered'}
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
        let flag = await this.prisma.user.findUnique({
            where: {email: data.email}
        })
        if(!flag) throw new UnauthorizedException("Invalid Credentials")

        const garamEnak = await bcrypt.compare(data.password, flag.password)
        
        if(!garamEnak) throw new UnauthorizedException("Invalid Credentials")

        // to be implemented

        return {message: 'login successful'}
    }

}
