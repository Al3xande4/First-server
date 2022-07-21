import { Photo } from './photo';

export interface IPhotoStorage {
	get photos(): Photo[];
	get(id: number): Photo | undefined;
	insert: (photo: Photo) => void;
	valid: (photo: Photo) => IValidMessage;
}

export interface IValidMessage {
	isValid: Boolean;
	message: string;
}
