import { ILogger } from "../../logger/logger.interface.js";
import { Photo } from "./photo.js";
import { IPhotoStorage } from "./storage.interface.js";

export class PhotosStorage implements IPhotoStorage{

    private _photos: Photo[];
    logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
        this._photos = [];
    };

    get photos(): Photo[] {
        return this._photos;
    };

    get(id: number): Photo | undefined {
        for(const photo of this._photos) {
            if(photo.id == id){
                return photo;
            };
        };
        return undefined;
    };

    insert(photo: Photo){
        this._photos.push(photo);
    };

    valid(photo: Photo){

        if(!photo.id) {
            return  {isValid: false, message: 'Photo should have an id' };
        };
        
        if(this.get(photo.id)) {
            return { isValid: false, message: 'Photo already exists' };
        };

        if(!photo.possition){
            return { isValid: false, message: 'Photo should have a possition'};
        };

        return { isValid: true, message: 'Photo successfully created' };
        
    };

};