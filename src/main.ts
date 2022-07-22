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
import { IUserService } from './users/user.service.interface';
import { UserService } from './users/user.service';
import { IUserStorageService } from './users/storage.service.interface';
import { UserStorageService } from './users/storage.service';
import { ITokenService } from './users/token.service.interface';
import { TokenService } from './users/token.service';
import { IUserController } from './users/users.controller.interface';
import { IPhotoController } from './photos/photos.controller.interface';
import { IPhotoStorageService } from './photos/storage.service.interface';
import { PhotoStorageService } from './photos/storage.service';
import { IPhotoService } from './photos/photo.service.interface';
import { PhotoService } from './photos/photo.service';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<ILogger>(TYPES.Logger).to(LoggerService);
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IUserController>(TYPES.UserController).to(UsersController);
	bind<IPhotoController>(TYPES.PhotoController).to(PhotosController);
	bind<IUserStorage>(TYPES.UserStorage).to(UsersStorage);
	bind<IPhotoStorage>(TYPES.PhotoStorage).to(PhotosStorage);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<IUserStorageService>(TYPES.UserStorageService).to(UserStorageService);
	bind<ITokenService>(TYPES.TokenService).to(TokenService);
	bind<IPhotoStorageService>(TYPES.PhotoStorageService).to(PhotoStorageService);
	bind<IPhotoService>(TYPES.PhotoService).to(PhotoService);
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
