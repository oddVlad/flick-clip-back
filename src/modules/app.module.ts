import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ClipsModule } from './clips/clips.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/users.entity';
import { Clips } from './clips/clips.entity';
import { SocketModule } from './socket/socket.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import config from 'src/config';
import { Subscriptions } from './subscriptions/subscriptions.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [config],
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				port: configService.get('dbPort'),
				host: configService.get('dbHost'),
				username: configService.get('dbUser'),
				password: configService.get('dbPassword'),
				database: configService.get('dbName'),
				entities: [Users, Clips, Subscriptions],
				synchronize: true,
			}),
		}),
		CacheModule.register({
			isGlobal: true,
			store: redisStore,
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
		}),
		AuthModule,
		ClipsModule,
		UsersModule,
		SocketModule,
		SubscriptionsModule,
	],
	providers: [],
})
export class AppModule {}
