import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { HttpExeption } from '../errors/http-error';
import { ILogger } from '../logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserService } from './user.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthMiddleware } from '../common/auth.middleware';
import { ValidateMiddleware } from '../common/validate.middleware';
import { IUserController } from './users.controller.interface';
import { IConfigService } from '../config/config.service.interface';
import { sign } from 'jsonwebtoken';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UsersController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.Logger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
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
				middlewares: [new AuthGuard()],
			},
			{
				path: '/secret',
				method: 'get',
				func: this.secret,
				middlewares: [new AuthGuard()],
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
			return next(new HttpExeption('User already exists error', 422));
		}

		const token = await this.signJWT(body.email, this.configService.get('ACCESS_TOKEN'));
		this.ok(res, { jwt: token });
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HttpExeption('Auth error', 401));
		}
		const token = await this.signJWT(body.email, this.configService.get('ACCESS_TOKEN'));
		this.ok(res, { jwt: token });
	}

	async users(req: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, { users: await this.userService.getUsers() });
	}

	secret({ body }: Request, res: Response, next: NextFunction): void {
		this.ok(res, body.email);
		next();
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise((resolve, reject) => {
			sign(
				{ email, iat: Math.floor(Date.now() / 1000) },
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
