import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../strategy/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenStrategy } from 'src/strategy/jwt.refresh-strategy';

@Module({
	imports: [
		UsersModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			global: true,
			secret: process.env.SECRET_KEY,
			signOptions: {
				expiresIn: process.env.EXPIRES_TOKEN,
			},
		}),
	],
	providers: [AuthService, JwtStrategy, RefreshTokenStrategy, JwtService],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
