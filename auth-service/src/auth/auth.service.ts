import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
