import { Response, Request, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { ILogger } from '../logger/logger.interface';
import { HttpExeption } from '../errors/http-error';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IPhotoController } from './photos.controller.interface';
import 'reflect-metadata';
import { AuthecateMiddleware } from '../common/authecate.middleware';
import { ValidateMiddleware } from '../common/validate.middleware';
import { PhotoCreateDto } from './dto/photo-create.dto';
import { PhotoGetDto } from './dto/photo-get.dto';
import { IPhotoService } from './photo.service.interface';
import { IPhotoStorageService } from './storage.service.interface';

@injectable()
export class PhotosController extends BaseController implements IPhotoController {
	constructor(
		@inject(TYPES.Logger) private serviceLogger: ILogger,
		@inject(TYPES.PhotoService) private photoService: IPhotoService,
		@inject(TYPES.PhotoStorageService) private photoStorageService: IPhotoStorageService,
	) {
		super(serviceLogger);
		this.router.use(new AuthecateMiddleware().execute);
		this.bindRoutes([
			{
				path: '/',
				method: 'get',
				func: this.photos,
			},
			{
				path: '/create',
				method: 'post',
				func: this.create,
				middlewares: [new ValidateMiddleware(PhotoCreateDto)],
			},
			{
				path: '/get',
				method: 'post',
				func: this.get,
				middlewares: [new ValidateMiddleware(PhotoGetDto)],
			},
		]);
	}

	photos(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, this.photoStorageService.storage.photos);
		next();
	}

	create({ body }: Request<{}, {}, PhotoCreateDto>, res: Response, next: NextFunction): void {
		const resutl = this.photoService.createPhoto(body);
		if (!resutl) {
			next(new HttpExeption('', 422));
			return;
		}
		const success = this.photoStorageService.insertPhoto(resutl);
		if (!success) {
			next(new HttpExeption('Coulndnt create the photo', 422));
			return;
		}
		this.ok(res, 'Photo created');
		next();
	}

	get({ body }: Request<{}, {}, PhotoGetDto>, res: Response, next: NextFunction): void {
		const photo = this.photoStorageService.findPhoto(body.id);
		if (!photo) {
			next(new HttpExeption(`Photot with id ${body} doesn't exist`, 422));
			return;
		}
		res.json(photo);
		next();
	}
}
