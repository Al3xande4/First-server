import { BodyParser } from "body-parser";
import express, { Express } from "express";
import {Server} from 'http';
import { ExeptionFilter } from "./errors/exeption.filter.js";
import { ILogger } from "./logger/logger.interface.js";
import { PhotosController } from "./photos/photos.controller.js";
import { UsersController } from "./users/users.controller.js";


export class App{
    app: Express;
    port: number;
    server: Server;
    logger: ILogger;
    usersController: UsersController;
    exeptionFilter: ExeptionFilter;
    bodyParser: BodyParser;
    photosController: PhotosController;

    constructor(
        logger: ILogger,
        usersController: UsersController,
        photosController: PhotosController,
        exeptionFilter: ExeptionFilter,
        bodyParser: BodyParser
    ){
        this.app = express();
        this.port = 3000;
        this.logger = logger;
        this.usersController = usersController;
        this.photosController = photosController;
        this.exeptionFilter = exeptionFilter;
        this.bodyParser = bodyParser;
    };

    useRoutes(){
        this.app.use('/users', this.usersController.router);
        this.app.use('/photos', this.photosController.router)
    };

    useMiddlewares(){
        this.app.use(this.bodyParser.json());
    };

    useExeptionFilters(){
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
    };

    init(){
        this.useMiddlewares();
        this.useRoutes();
        this.useExeptionFilters();
        this.server = this.app.listen(this.port);
        this.logger.info('server is listening');
    };
};