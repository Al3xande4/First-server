import { App } from './app';
import { ExeptionFilter } from './errors/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { UsersStorage } from './users/storage/users.storage';
import { PhotosController } from './photos/photos.controller';
import dotenv from 'dotenv';
import { PhotosStorage } from './photos/storage/photos.storage';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IPhotoStorage } from './photos/storage/storage.interface';
import { IUserStorage } from './users/storage/storage.interface';
import 'reflect-metadata';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<ILogger>(TYPES.Logger).to(LoggerService);
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<UsersController>(TYPES.UserController).to(UsersController);
	bind<PhotosController>(TYPES.PhotoController).to(PhotosController);
	bind<IUserStorage>(TYPES.UserStorage).to(UsersStorage);
	bind<IPhotoStorage>(TYPES.PhotoStorage).to(PhotosStorage);
});

function bootstrap(): IBootstrapReturn {
	dotenv.config();
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
