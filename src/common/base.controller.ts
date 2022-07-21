import { Response, Router } from 'express';
import { injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { ExpressReturnType, IControllerRoute } from './route.interface';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	logger: ILogger;

	private readonly _router: Router;

	get router(): Router {
		return this._router;
	}

	constructor(logger: ILogger) {
		this._router = Router();
		this.logger = logger;
	}

	bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.info(`[${route.method}]: ${route.path}`);
			const handler = route.func.bind(this);
			this.router[route.method](route.path, handler);
		}
	}

	public send<T>(res: Response, message: T, statusCode: number): ExpressReturnType {
		return res.status(statusCode).send(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, message, 200);
	}
}
