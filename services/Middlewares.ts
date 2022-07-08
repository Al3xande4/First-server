import { HttpExeption } from '../services/Errors.js';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const errorMiddleware = (error: HttpExeption, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status).send(error.message)
    next();
};

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) {
        throw new HttpExeption('No token', 401);
    };
    if(process.env.ACCESS_TOKEN != null) {
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, username) => {
            if(err) {
                throw new HttpExeption('Token is not valid', 403);
            };
            req.body.username = username;
            next();
        });
    };
};

export {errorMiddleware, authenticateToken}