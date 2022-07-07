import { HttpExeption } from '../services/Errors.js';
import { NextFunction, Request, Response } from 'express';

const errorMiddleware = (error: HttpExeption, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status).send(error.message)
    next();
};

export {errorMiddleware}