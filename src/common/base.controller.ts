import { Response, Router } from "express";
import { ILogger } from "../logger/logger.interface";
import { IControllerRoute } from "./route.interface";

export abstract class BaseController{
    logger: ILogger;

    private readonly _router: Router;

    get router(){
        return this._router;
    };

    constructor(logger: ILogger){
        this._router = Router();
        this.logger = logger;
    };

    bindRoutes(routes: IControllerRoute[]){
        for(const route of routes) {
            this.logger.info(`[${route.method}]: ${route.path}`);
            const handler = route.func.bind(this);
            this.router[route.method](route.path, handler);
        };
    };

    public send<T>(res: Response, message: T, statusCode: number) {
        res.status(statusCode).send(message);
    };

    public ok<T>(res: Response, message: T) {
        this.send<T>(res, message, 200);
    };

};