import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		abortOnError: false,
		cors: {
			origin: [process.env.CLIENT_API],
		},
	});
	const configService = app.get(ConfigService);
	const port = configService.get('port');
	await app.listen(port);
}

bootstrap();
