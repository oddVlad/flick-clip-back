import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { UsersModule } from '../users/users.module';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscriptions } from './subscriptions.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Subscriptions]), UsersModule],
	providers: [SubscriptionsService, JwtService],
	controllers: [SubscriptionsController],
	exports: [TypeOrmModule, SubscriptionsService],
})
export class SubscriptionsModule {}
