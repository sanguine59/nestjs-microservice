import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface UserData {
  username: string;
  email: string;
  country: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UserProfileData {
  username: string;
  email: string;
  country: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: UserData) {
    if (!this.validateRegister(data)) throw new BadRequestException('Bad Credentials');

    const isUnique = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (isUnique) throw new ConflictException('Email Already Registered');

    const hashed = await bcrypt.hash(data.password, 10);

    await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        country: data.country,
        password: hashed,
        role: 'USER',
      },
    });

    return { status: 200, message: 'User Registered' };
  }

  private validateRegister(data: UserData): boolean {
    if (!data.username || !data.email || !data.password || data.country === undefined) return false;

    if (data.username.length < 4 || data.username.length > 40) return false;

    let atCount = 0;
    for (const c of data.email) if (c === '@') atCount++;
    if (atCount !== 1) return false;
    if (!data.email.includes('.')) return false;
    if (data.email.includes('@.') || data.email.includes('.@')) return false;

    if (data.password.length < 8 || data.password.length > 40) return false;

    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSpecial = false;
    const specialChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~\\";

    for (const char of data.password) {
      if (char >= 'A' && char <= 'Z') hasUpper = true;
      else if (char >= 'a' && char <= 'z') hasLower = true;
      else if (char >= '0' && char <= '9') hasNumber = true;
      else if (specialChars.includes(char)) hasSpecial = true;
    }

    return hasLower && hasUpper && hasNumber && hasSpecial;
  }

  async login(data: LoginData) {
    if (!data.email || !data.password) throw new UnauthorizedException('Invalid Credentials');

    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const matches = await bcrypt.compare(data.password, user.password);
    if (!matches) throw new UnauthorizedException('Invalid Credentials');

    const payload = {
      id: user.user_id,
      role: user.role,
    };

    return {
      status: 200,
      access_token: await this.jwtService.signAsync(payload),
      message: 'login successful',
    };
  }

  async getInfo(id: string): Promise<UserProfileData> {
    const user = await this.prisma.user.findUnique({
      where: { user_id: id },
      select: {
        username: true,
        email: true,
        country: true,
        role: true,
      },
    });
    if (!user) throw new NotFoundException('ID NOT FOUND');

    return {
      username: user.username,
      email: user.email,
      country: user.country,
      role: user.role,
    };
  }
}
