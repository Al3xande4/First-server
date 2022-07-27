import bodyParser from 'body-parser';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILogger } from './logger/logger.interface';
import { PhotosController } from './photos/photos.controller';
import { TYPES } from './types';
import { UsersController } from './users/users.controller';
import 'reflect-metadata';
import { PrismaService } from './database/prisma.service';
import { IConfigService } from './config/config.service.interface';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.UserController) private usersController: UsersController,
		@inject(TYPES.PhotoController) private photosController: PhotosController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		this.app = express();
		this.port = 3000;
	}

	useRoutes(): void {
		this.app.use('/users', this.usersController.router);
		this.app.use('/photos', this.photosController.router);
	}

	useMiddlewares(): void {
		this.app.use(bodyParser.json());
		const authMiddleware = new AuthMiddleware(this.configService.get('ACCESS_TOKEN'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useExeptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.info('server is listening');
	}
}
