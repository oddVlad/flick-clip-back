import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from '../users/users.entity';

@Entity()
export class Subscriptions {
	@PrimaryColumn('uuid')
	public subscriberId: string;

	@ManyToOne(() => Users, users => users.subscriptions, { nullable: false })
	@JoinColumn({ name: 'subscriberId' })
	public subscriber: Users;

	@PrimaryColumn('uuid')
	public subscriptionTargetId: string;

	@ManyToOne(() => Users, users => users.subscribers, { nullable: false })
	@JoinColumn({ name: 'subscriptionTargetId' })
	public subscriptionTarget: Users;

	@CreateDateColumn()
	public readonly createdAt: Date;
}
