import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Subscriptions } from './subscriptions.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubscriptionsService {
	constructor(
		@InjectRepository(Subscriptions)
		private subsRepository: Repository<Subscriptions>,
	) {}

	async create(followerId: string, followingId: string): Promise<Subscriptions> {
		try {
			const newSubs = this.subsRepository.create({
				subscriberId: followerId,
				subscriptionTargetId: followingId,
			});

			return this.subsRepository.save(newSubs);
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async getFollowers(id: string): Promise<Subscriptions[]> {
		try {
			return await this.subsRepository.query(
				`SELECT 
					"subscriberId" 
				FROM subscriptions 
				WHERE subscriptions."subscriptionTargetId" = $1`,
				[id],
			);
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
