import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClipsService } from './clips.service';
import { ClipsController } from './clips.controller';
import { Clips } from './clips.entity';
import { UsersModule } from '../users/users.module';
import { SocketModule } from '../socket/socket.module';

@Module({
	imports: [TypeOrmModule.forFeature([Clips]), UsersModule, SocketModule],
	providers: [ClipsService, JwtService],
	controllers: [ClipsController],
	exports: [TypeOrmModule, ClipsService],
})
export class ClipsModule {}
