import { Response, Request, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { ILogger } from '../logger/logger.interface';
import { HttpExeption } from '../errors/http-error';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IPhotoController } from './photos.controller.interface';
import 'reflect-metadata';
import { AuthMiddleware } from '../common/auth.middleware';
import { ValidateMiddleware } from '../common/validate.middleware';
import { PhotoCreateDto } from './dto/photo-create.dto';
import { PhotoGetDto } from './dto/photo-get.dto';
import { IPhotoService } from './photo.service.interface';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class PhotosController extends BaseController implements IPhotoController {
	constructor(
		@inject(TYPES.Logger) private serviceLogger: ILogger,
		@inject(TYPES.PhotoService) private photoService: IPhotoService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(serviceLogger);
		this.bindRoutes([
			{
				path: '/',
				method: 'get',
				func: this.photos,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/create',
				method: 'post',
				func: this.create,
				middlewares: [new ValidateMiddleware(PhotoCreateDto), new AuthGuard()],
			},
			{
				path: '/get',
				method: 'post',
				func: this.get,
				middlewares: [new ValidateMiddleware(PhotoGetDto), new AuthGuard()],
			},
		]);
	}

	async photos(req: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, { photos: await this.photoService.getPhotos() });
	}

	async create(
		{ body }: Request<{}, {}, PhotoCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const resutl = await this.photoService.createPhoto(body);
		if (!resutl) {
			next(new HttpExeption('', 422));
			return;
		}

		this.ok(res, { photo: resutl });
	}

	async get(
		{ body }: Request<{}, {}, PhotoGetDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.photoService.getPhoto(body);
		if (!result) {
			return next(new HttpExeption("Photo doesn't exits", 422));
		}
		this.ok(res, { photo: result });
	}
}
