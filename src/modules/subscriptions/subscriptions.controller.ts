import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../Guards/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import { User } from '../users/user.decorator';
// import { User as UserEntity } from '../user/user.entity';

@Controller('subscription')
export class SubscriptionsController {
	constructor(private subService: SubscriptionsService) {}

	@UseGuards(JwtAuthGuard)
	@Post('')
	async subscribing(@Body() { followId }: any, @User() user) {
		return await this.subService.create(user.id, followId);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/subs')
	async getFollowers(@User() user): Promise<any[]> {
		return await this.subService.getFollowers(user.id);
	}
}
