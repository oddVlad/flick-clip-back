import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/Guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@WebSocketGateway(8080, {
	cors: {
		origin: 'http://localhost:3000',
	},
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly connectedClients: Map<string, Socket> = new Map();
	constructor(private usersService: UsersService) {}
	@WebSocketServer()
	public server: Server;

	@UseGuards(JwtAuthGuard)
	handleConnection(client: Socket): void {
		this.connectedClients.set(client.id, client);
		this.usersService.update(client.handshake.auth.user?.id, {
			connectionId: client.id,
		});
	}

	handleDisconnect(client: Socket): void {
		this.connectedClients.delete(client.id);
		this.usersService.update(client.handshake.auth.user?.id, { connectionId: '' });
	}

	handleTriggerClips(connections: string[]): void {
		this.server.to(connections).emit('update-clips');
	}
}
