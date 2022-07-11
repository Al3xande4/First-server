import { Response, Request, NextFunction } from "express";
import { BaseController } from "../common/base.controller.js";
import { ILogger } from "../logger/logger.interface.js";
import { HttpExeption } from "../errors/http-error.js";
import jwt from 'jsonwebtoken';
import { IPhotoStorage } from "./storage/storage.interface.js";

export class PhotosController extends BaseController{
    storage: IPhotoStorage;

    constructor(logger: ILogger, storage: IPhotoStorage){
        super(logger);
        this.storage = storage;
        this.router.use(this.authecateToken);
        this.bindRoutes([
            { path: '/', method: 'get', func: this.photos },
            { path: '/create', method: 'post', func: this.create },
            { path: '/get', method: 'post', func: this.get }
        ])
    };

    photos(req: Request, res: Response, next: NextFunction){
        this.ok(res, this.storage.photos);
        next();
    };

    create(req: Request, res: Response, next: NextFunction){
        const photo = req.body.photo;
        const validMessage = this.storage.valid(photo);
        if(!validMessage.isValid) {
            next(new HttpExeption(validMessage.message, 400));
            return;
        };
        this.storage.insert(photo);
        this.ok(res, 'Photo created');
        next();
    };

    get(req: Request, res: Response, next: NextFunction){
        const photo = this.storage.get(req.body.id);
        if(photo){
            res.json(photo);
            next();
        }
        else{
            next(new HttpExeption(`Photo with id ${req.body.id} doesnt exist`, 400));
        };
    };

    authecateToken(req: Request, res: Response, next: NextFunction){
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) {
            return next(new HttpExeption('No token', 401))
        };

        if (process.env.ACCESS_TOKEN != undefined) {
            jwt.verify(token, process.env.ACCESS_TOKEN, (err, username) => {
                
                if (err) {
                    next(new HttpExeption(err.message, 403));
                }
                else{
                    req.body.username = username;
                    return next();
                }
            });
        };
    };


};