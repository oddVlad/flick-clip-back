import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../Guards/jwt-auth.guard';
import { ClipsService } from './clips.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../users/user.decorator';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Clips } from './clips.entity';
import { IGetOneClipResponse } from './clips-interfaces';

@Controller('clip')
export class ClipsController {
	constructor(private clipService: ClipsService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	async getAll(@User() user): Promise<any> {
		const userId = user.id;
		if (userId) {
			return await this.clipService.getFamilar(userId);
		}
		return await this.clipService.getAll();
	}

	@UseGuards(JwtAuthGuard)
	@Get('/search?')
	async filterFind(@Query('tags') tags: string): Promise<Clips[]> {
		const splitedTags = decodeURIComponent(tags).split(' ');

		return await this.clipService.getByTags(splitedTags);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/:id')
	async getOne(@Param('id') id: string, @User() user): Promise<IGetOneClipResponse> {
		const clip = await this.clipService.getOne(id);

		if (user.id === clip.creatorId) {
			clip.isCreatorCurrentUser = true;
			return clip;
		}

		return clip;
	}

	// @UseGuards(JwtAuthGuard)
	@Get('/stream/:filename')
	async streamFile(@Param('filename') filename: string, @Res() res): Promise<void> {
		const file = createReadStream(join(__dirname, '../../clips/', filename));
		file.pipe(res);
	}

	@UseGuards(JwtAuthGuard)
	@Post()
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@User() user, @Body() body, @UploadedFile() file: Express.Multer.File) {
		const clipData = {
			...body,
			file,
			creatorId: user.id,
		};

		return await this.clipService.create(clipData);
	}
}
