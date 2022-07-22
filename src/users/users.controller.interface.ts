import { NextFunction, Request, Response } from 'express';

export interface IUserController {
	users: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	secret: (req: Request, res: Response, next: NextFunction) => void;
}
