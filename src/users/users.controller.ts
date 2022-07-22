import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HttpExeption } from '../errors/http-error';
import { ILogger } from '../logger/logger.interface';
import { IUserStorage } from './storage/storage.interface';
import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserService } from './user.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthecateMiddleware } from '../common/authecate.middleware';
import { ValidateMiddleware } from '../common/validate.middleware';
import { IUserStorageService } from './storage.service.interface';
import { ITokenService } from './token.service.interface';
import { IUserController } from './users.controller.interface';

@injectable()
export class UsersController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.Logger) private loggerService: ILogger,
		@inject(TYPES.UserStorage) private storage: IUserStorage,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.UserStorageService) private userStorageService: IUserStorageService,
		@inject(TYPES.TokenService) private tokenService: ITokenService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/',
				method: 'get',
				func: this.users,
				middlewares: [new AuthecateMiddleware()],
			},
			{
				path: '/secret',
				method: 'get',
				func: this.secret,
				middlewares: [new AuthecateMiddleware()],
			},
		]);
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return;
		}
		const success = this.userStorageService.insertUser(result);
		if (!success) {
			next(new HttpExeption(`User ${result.email} already exists`, 422));
			return;
		}
		const token = this.tokenService.saveToken(result.email);
		if (!token) {
			this.logger.error('something went wrong');
			next(new Error('wrong'));
			return;
		}
		this.ok(res, `You successfully registered as ${result.name}, your token is ${token}`);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const user = this.userStorageService.findUser(body.email);
		if (!user) {
			next(new HttpExeption(`User with email ${body.email} doesn't exists`, 422));
			return;
		}
		if (await this.userService.checkPassword(user.password, body.password)) {
			this.tokenService.saveToken(user.email);
			const token = this.tokenService.saveToken(user.email);
			if (!token) {
				this.logger.error('something went wrong');
				next(new Error('wrong'));
				return;
			}
			this.ok(res, `You successfully registered as ${user.name}, your token is ${token}`);
		} else {
			next(new HttpExeption('Wrong password', 400, 'register'));
		}
	}

	users(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, this.userStorageService.storage.users);
		next();
	}

	secret({ body }: Request, res: Response, next: NextFunction): void {
		this.ok(res, body.email);
		next();
	}
}
