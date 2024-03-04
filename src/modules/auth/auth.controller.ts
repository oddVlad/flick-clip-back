import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ILoginDTO, ILoginResponse, ISignUpDTO, ISignUpResponse, IToken } from './auth-interfaces';
import { JwtAuthGuard } from '../../Guards/jwt-auth.guard';
import { RefreshTokenGuard } from 'src/Guards/refresh-jwt-auth.guard';
import { User } from '../users/user.decorator';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	async login(@Body() body: ILoginDTO): Promise<ILoginResponse> {
		const userValid = await this.authService.validateLoginUser(body);
		const loggedUser = await this.authService.login(userValid);
		return loggedUser;
	}

	@Post('signup')
	async sigup(@Body() body: ISignUpDTO): Promise<ISignUpResponse> {
		const userValid = await this.authService.validateSignUpUser(body);
		const newUser = await this.authService.signup(userValid);
		return newUser;
	}

	@UseGuards(JwtAuthGuard)
	@Get('logout')
	logout(@User() user): void {
		this.authService.logout(user.id);
	}

	@UseGuards(RefreshTokenGuard)
	@Get('refresh')
	async refreshTokens(@User() user): Promise<IToken<string>> {
		const { sub, refreshToken } = user;

		return await this.authService.refreshTokens(sub, refreshToken);
	}
}
