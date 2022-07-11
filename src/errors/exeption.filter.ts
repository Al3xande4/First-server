import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { ILogger } from "../logger/logger.interface.js";
import { IExeptionFilter } from "./exeption.filter.interface.js";
import { HttpExeption } from "./http-error.js";

export class ExeptionFilter implements IExeptionFilter{
    logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
    };

    catch(err: Error | HttpExeption, req: Request, res: Response, next: NextFunction){
        if(err instanceof HttpExeption) {
            this.logger.error(`[${err.context}] ${err.statusCode}: ${err.message}`);
            res.status(err.statusCode).send(err.message);
        }
        else{
            this.logger.error(`${err.message}`);
            res.status(500).send(err.message);
        };
    };
};