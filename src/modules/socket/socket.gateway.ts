import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/Guards/jwt-auth.guard';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@WebSocketGateway(8080, {
	cors: {
		origin: 'http://localhost:3000',
	},
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}
	@WebSocketServer()
	public server: Server;

	@UseGuards(JwtAuthGuard)
	handleConnection(client: Socket): void {
		this.cacheService.set(client.handshake.auth.user?.id, client.id);
	}

	handleDisconnect(client: Socket): void {
		this.cacheService.del(client.handshake.auth.user?.id);
	}

	async handleTriggerClips(subscriberIds: string[]): Promise<void> {
		for (const id of subscriberIds) {
			const connection = await this.cacheService.get<string>(id);
			if (connection) {
				this.server.to(connection).emit('update-clips');
			}
		}
	}
}
