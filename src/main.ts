import { App } from "./app.js";
import { ExeptionFilter } from "./errors/exeption.filter.js";
import { LoggerService } from "./logger/logger.service.js";
import { UsersController } from "./users/users.controller.js";
import bodyParser from 'body-parser' ;
import { UsersStorage } from "./users/storage/users.storage.js";
import { PhotosController } from "./photos/photos.controller.js";
import dotenv from 'dotenv';
import { PhotosStorage } from "./photos/storage/photos.storage.js";


async function bootstrap(){
    dotenv.config();

    const logger = new LoggerService();

    const app = new App(
        logger,
        new UsersController(logger, new UsersStorage(logger)),
        new PhotosController(logger, new PhotosStorage(logger)),
        new ExeptionFilter(logger),
        bodyParser    
    );

    await app.init();
};

bootstrap();