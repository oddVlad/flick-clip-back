import { Inject, Injectable } from '@nestjs/common';
import { ArrayContains, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Clips } from './clips.entity';
import { IPostClipRequest, IGetOneClipResponse } from './clips-interfaces';
import * as fs from 'fs';
import * as path from 'path';
import { SocketGateway } from '../socket/socket.gateway';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class ClipsService {
	constructor(
		@InjectRepository(Clips)
		private ClipsRepository: Repository<Clips>,
		private socketGateway: SocketGateway,
		private subsService: SubscriptionsService,
		@Inject(CACHE_MANAGER) private cacheService: Cache,
	) {}

	public async getOne(id: string): Promise<IGetOneClipResponse> {
		try {
			const clip = await this.ClipsRepository.query(
				`SELECT 
					users.username AS "creatorName",
					clips."creatorId",
					clips.id,
					clips.title,
					clips.tags,
					clips."createdAt",
					clips.url
				FROM users 
					JOIN clips ON clips."creatorId" = users.id 
				WHERE 
					clips.id = $1;`,
				[id],
			);
			if (!clip) throw new Error('Clip does not exist');
			return clip[0];
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public async getAll(): Promise<Clips[]> {
		return await this.ClipsRepository.find({ order: { createdAt: 'DESC' } });
	}

	public async getFamilar(id): Promise<Clips[]> {
		return await this.ClipsRepository.query(
			`SELECT 
				*
			FROM clips WHERE clips."creatorId" IN 
				(SELECT "subscriptionTargetId" 
					FROM subscriptions 
					WHERE subscriptions."subscriberId" = $1
				) OR clips."creatorId" = $1 ORDER BY "createdAt" DESC`,
			[id],
		);
	}

	public async getByTags(tags: string[]): Promise<Clips[]> {
		const cachedData = await this.cacheService.get<Clips[]>(tags.toString());

		if (cachedData) {
			return cachedData;
		}

		try {
			const clip = await this.ClipsRepository.find({
				where: {
					tags: ArrayContains(tags),
				},
				order: { createdAt: 'DESC' },
			});

			await this.cacheService.set(tags.toString(), clip);
			return clip;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public async create(clips: IPostClipRequest): Promise<Clips> {
		try {
			const { title, tags, file, creatorId } = clips;
			const filePath = await this.saveClipsFS(file);
			const createdClips = await this.ClipsRepository.create({
				url: filePath,
				title,
				tags: tags ? tags.split(' ') : [],
				creatorId,
			});
			const newClips = await this.ClipsRepository.save(createdClips);
			const subsribers = await this.subsService.getFollowers(newClips.creatorId);
			const subsribersIds = subsribers.map(sub => sub.subscriberId);
			this.socketGateway.handleTriggerClips(subsribersIds.concat(newClips.creatorId));

			return newClips;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	private async saveClipsFS(file: Express.Multer.File): Promise<string> {
		try {
			const fileName = `Clips_${Date.now().toString()}.webm`;
			const dirPath = path.join(__dirname, '../../', 'clips');

			if (!fs.existsSync(dirPath)) {
				fs.mkdirSync(dirPath, { recursive: true });
			}

			const filePath = path.join(dirPath, fileName);
			const writeStream = await fs.createWriteStream(filePath);
			await writeStream.write(file.buffer);
			writeStream.close();

			return fileName;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
