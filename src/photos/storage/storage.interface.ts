import { Photo } from "./photo.js";

export interface IPhotoStorage{
    get photos(): Photo[];
    get(id: number): Photo | undefined;
    insert: (photo: Photo) => void;
    valid: (photo: Photo) => IValidMessage;
};

interface IValidMessage{
    isValid: Boolean;
    message: string;
};

