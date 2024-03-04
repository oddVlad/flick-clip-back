import { Injectable } from '@nestjs/common';

@Injectable()
export class UserDto {
	id: string;
	username: string;
	password: string;
	refreshToken: string;
	createdAt: Date;
}
