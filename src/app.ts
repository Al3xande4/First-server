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
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.info('server is listening');
	}
}
