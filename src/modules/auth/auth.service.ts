import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import {
	ILoginDTO,
	ILoginResponse,
	ILogoutResponse,
	ISignUpDTO,
	ISignUpResponse,
	IToken,
} from './auth-interfaces';
import { Users } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	public async validateLoginUser({ username, password }: ILoginDTO): Promise<Users> {
		const user = await this.userService.findOne(username);
		if (!user) throw new BadRequestException('User does not exist');
		const passwordConfirm = await verify(user.password, password);
		if (!passwordConfirm) throw new BadRequestException('Passwords do not match');
		return user;
	}

	public async validateSignUpUser(user: ISignUpDTO): Promise<ISignUpDTO> {
		const { username, password, passwordConfirm } = user;
		const isUserExist = await this.userService.findOne(username);
		if (isUserExist) throw new BadRequestException('User already exist');
		const isPasswordValid = password === passwordConfirm;
		if (!isPasswordValid) throw new BadRequestException('Passwords do not match');
		return user;
	}

	public async login(user: Users): Promise<ILoginResponse> {
		const tokens = await this.getTokens(user.id, user.username);
		await this.updateRefreshToken(user.id, tokens.refreshToken);

		return {
			user: {
				id: user.id,
				name: user.username,
			},
			token: tokens,
		};
	}

	public async logout(userId: string): Promise<ILogoutResponse> {
		await this.userService.update(userId, {
			refreshToken: null,
		});

		return {
			accessToken: null,
			refreshToken: null,
		};
	}

	public async signup(user: ISignUpDTO): Promise<ISignUpResponse> {
		const newUser = await this.userService.create(user);
		const tokens = await this.getTokens(newUser.id, newUser.username);
		await this.updateRefreshToken(newUser.id, tokens.refreshToken);

		return {
			user: {
				id: newUser.id,
				name: newUser.username,
			},
			token: tokens,
		};
	}

	private async getTokens(id: string, username: string): Promise<IToken<string>> {
		const accessToken = await this.jwtService.sign(
			{
				sub: id,
				username,
			},
			{
				secret: this.configService.get('secretKey'),
				expiresIn: this.configService.get('expiresToken'),
			},
		);
		const refreshToken = await this.jwtService.sign(
			{
				sub: id,
				username,
			},
			{
				secret: this.configService.get('secretRefreshKey'),
				expiresIn: this.configService.get('expiresRefreshToken'),
			},
		);
		return {
			accessToken,
			refreshToken,
		};
	}

	public async updateRefreshToken(userId: string, refreshToken: string) {
		const hashedRefreshToken = await hash(refreshToken);

		await this.userService.update(userId, {
			refreshToken: hashedRefreshToken,
		});
	}

	public async refreshTokens(userId, refreshToken): Promise<IToken<string>> {
		const user = await this.userService.findById(userId);
		if (!user || !user.refreshToken) throw new ForbiddenException('Access denied');
		const refreshTokenMatches = await verify(user.refreshToken, refreshToken);
		if (!refreshTokenMatches) throw new ForbiddenException('Access denied');
		const tokens = await this.getTokens(userId, user.username);
		await this.updateRefreshToken(userId, tokens.refreshToken);

		return tokens;
	}
}
