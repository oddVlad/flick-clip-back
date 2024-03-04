import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subscriptions } from '../subscriptions/subscriptions.entity';

@Entity({ name: 'users' })
export class Users {
	@PrimaryGeneratedColumn('uuid')
	public readonly id: string;

	@Column()
	public username: string;

	@Column()
	public password: string;

	@Column({ nullable: true, default: null })
	public refreshToken?: string = null;

	@OneToMany(() => Subscriptions, subscription => subscription.subscriber)
	public subscriptions: Subscriptions[];

	@OneToMany(() => Subscriptions, subscription => subscription.subscriptionTarget)
	public subscribers: Subscriptions[];

	@Column({ default: '' })
	public connectionId: string;

	@CreateDateColumn()
	public readonly createdAt: Date;
}
