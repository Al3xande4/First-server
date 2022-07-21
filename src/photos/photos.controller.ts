import { Response, Request, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { ILogger } from '../logger/logger.interface';
import { HttpExeption } from '../errors/http-error';
import jwt from 'jsonwebtoken';
import { IPhotoStorage } from './storage/storage.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IPhotoController } from './photos.controller.interface';
import 'reflect-metadata';

@injectable()
export class PhotosController extends BaseController implements IPhotoController {
	constructor(
		@inject(TYPES.Logger) private serviceLogger: ILogger,
		@inject(TYPES.PhotoStorage) private storage: IPhotoStorage,
	) {
		super(serviceLogger);
		this.storage = storage;
		this.router.use(this.authecateToken);
		this.bindRoutes([
			{ path: '/', method: 'get', func: this.photos },
			{ path: '/create', method: 'post', func: this.create },
			{ path: '/get', method: 'post', func: this.get },
		]);
	}

	photos(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, this.storage.photos);
		next();
	}

	create(req: Request, res: Response, next: NextFunction): void {
		const photo = req.body.photo;
		const validMessage = this.storage.valid(photo);
		if (!validMessage.isValid) {
			next(new HttpExeption(validMessage.message, 400));
			return;
		}
		this.storage.insert(photo);
		this.ok(res, 'Photo created');
		next();
	}

	get(req: Request, res: Response, next: NextFunction): void {
		const photo = this.storage.get(req.body.id);
		if (photo) {
			res.json(photo);
			next();
		} else {
			next(new HttpExeption(`Photo with id ${req.body.id} doesnt exist`, 400));
		}
	}

	authecateToken(req: Request, res: Response, next: NextFunction): void {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (token == null) {
			next(new HttpExeption('No token', 401));
			return;
		}

		if (process.env.ACCESS_TOKEN != undefined) {
			jwt.verify(token, process.env.ACCESS_TOKEN, (err, username) => {
				if (err) {
					next(new HttpExeption(err.message, 403));
				} else {
					req.body.username = username;
					next();
					return;
				}
			});
		}
	}
}
