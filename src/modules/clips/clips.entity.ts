import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../users/users.entity';

@Entity()
export class Clips {
	@PrimaryGeneratedColumn('uuid')
	public readonly id: string;

	@Column()
	public title: string;

	@Column()
	public creatorId: string;

	@ManyToOne(() => Users, users => users.id, { nullable: false })
	@JoinColumn({ name: 'creatorId' })
	public creator: Users;

	@Column()
	public url: string;

	@Column({ array: true, type: 'text' })
	public tags: string[];

	@CreateDateColumn()
	public readonly createdAt;
}
