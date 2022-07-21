import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HttpExeption } from '../errors/http-error';
import { ILogger } from '../logger/logger.interface';
import { IUserStorage } from './storage/storage.interface';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';

@injectable()
export class UsersController extends BaseController {
	constructor(
		@inject(TYPES.Logger) private loggerService: ILogger,
		@inject(TYPES.UserStorage) private storage: IUserStorage,
	) {
		super(loggerService);

		this.bindRoutes([
			{ path: '/register', method: 'post', func: this.register },
			{ path: '/login', method: 'post', func: this.login },
		]);
		this.router.use(this.authecateToken);
		this.bindRoutes([
			{ path: '/', method: 'get', func: this.users },
			{ path: '/secret', method: 'get', func: this.secret },
		]);
	}

	register(req: Request, res: Response, next: NextFunction): void {
		const user = req.body.user;
		if (!this.storage.valid(user)) {
			next(new HttpExeption(`user with name ${user.name} already exists`, 400));
			return;
		} else {
			this.storage.insert(user);
			const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
			if (ACCESS_TOKEN != undefined) {
				const token = jwt.sign(user.name, ACCESS_TOKEN);
				this.ok(res, `You successfully registered as ${user.name}, your token ${token}`);
			} else {
				this.logger.error('something went wrong');
				next(new Error('wrong'));
			}
		}
	}

	login(req: Request, res: Response, next: NextFunction): void {
		const user = req.body.user;
		const realUser = this.storage.find(user.name);
		if (realUser) {
			if (realUser.password === user.password) {
				const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
				if (ACCESS_TOKEN != undefined) {
					const token = jwt.sign(user.name, ACCESS_TOKEN);
					this.ok(res, `You logged in as ${user.name}, your token ${token}`);
				} else {
					this.logger.error('something went wrong');
					next(new Error('wrong'));
				}
			} else {
				next(new HttpExeption('Wrong password', 400, 'register'));
			}
		} else {
			next(new HttpExeption(`No such user with name ${user.name}`, 400, 'register'));
		}
	}

	users(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, this.storage.users);
		next();
	}

	secret(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, req.body.username);
		next();
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
					next(new HttpExeption('Token is not valid', 403));
				} else {
					req.body.username = username;
					next();
					return;
				}
			});
		}
	}
}
