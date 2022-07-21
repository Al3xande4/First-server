import { NextFunction, Request, Response } from 'express';

export interface IPhotoController {
	photos: (req: Request, res: Response, next: NextFunction) => void;
	create: (req: Request, res: Response, next: NextFunction) => void;
	get: (req: Request, res: Response, next: NextFunction) => void;
}
