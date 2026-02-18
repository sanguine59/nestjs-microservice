import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(private configService: ConfigService) {
        const dbu = configService.get<string>('DATABASE_URL') ?? "mysql://root:@localhost:3306/iusearch_auth"
        const url = new URL(dbu)

        const adapter = new PrismaMariaDb({
            user: url.username,
            password: url.password,
            host: url.hostname,
            port: Number((url.port) || 3306),
            database: url.pathname.slice(1)

        })

        super({adapter})
    }


    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}