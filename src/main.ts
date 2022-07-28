import { App } from './app';
import { ExeptionFilter } from './errors/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { PhotosController } from './photos/photos.controller';
import dotenv from 'dotenv';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import 'reflect-metadata';
import { IUserService } from './users/user.service.interface';
import { IUserController } from './users/users.controller.interface';
import { IPhotoController } from './photos/photos.controller.interface';
import { IPhotoService } from './photos/photo.service.interface';
import { PhotoService } from './photos/photo.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { IUsersRepository } from './users/users.repository.interface';
import { UserService } from './users/user.service';
import { UsersRepository } from './users/users.repository';
import { IPhotosRepository } from './photos/photos.repository.interface';
import { PhotosRepository } from './photos/photos.repository';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IUserController>(TYPES.UserController).to(UsersController);
	bind<IPhotoController>(TYPES.PhotoController).to(PhotosController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<IPhotoService>(TYPES.PhotoService).to(PhotoService);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<IPhotosRepository>(TYPES.PhotosRepository).to(PhotosRepository).inSingletonScope();
});

function bootstrap(): IBootstrapReturn {
	dotenv.config();
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

export const boot = bootstrap();
