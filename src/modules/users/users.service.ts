import { Injectable } from '@nestjs/common';
import { Users } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISignUpDTO } from '../auth/auth-interfaces';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users)
		private usersRepository: Repository<Users>,
	) {}

	async findOne(username: string): Promise<Users> {
		return await this.usersRepository.findOneBy({ username });
	}

	async isExist(userId: string): Promise<boolean> {
		return await this.usersRepository.existsBy({ id: userId });
	}

	async findById(id: string): Promise<Users> {
		return await this.usersRepository.findOneBy({ id });
	}

	async create(user: ISignUpDTO): Promise<Users> {
		const { username, password } = user;
		const hashPassword = await hash(password);
		const newUser = await this.usersRepository.create({
			username,
			password: hashPassword,
		});

		return await this.usersRepository.save(newUser);
	}

	async update(userId: string, updateUserData: Partial<Users>): Promise<void> {
		await this.usersRepository.update(userId, { ...updateUserData });
	}
}
