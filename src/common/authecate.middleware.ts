import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import jwt from 'jsonwebtoken';
import { HttpExeption } from '../errors/http-error';

export class AuthecateMiddleware implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (token == null) {
			next(new HttpExeption('No token', 401));
			return;
		}

		if (process.env.ACCESS_TOKEN != undefined) {
			jwt.verify(token, process.env.ACCESS_TOKEN, (err, email) => {
				if (err) {
					next(new HttpExeption('Token is not valid', 403));
				} else {
					req.body.email = email;
					next();
					return;
				}
			});
		}
	}
}
