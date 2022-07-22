import { StoragePhoto } from './photo';

export interface IPhotoStorage {
	get photos(): StoragePhoto[];
	get(id: number): StoragePhoto | null;
	insert: (photo: StoragePhoto) => void;
	valid: (photo: StoragePhoto) => boolean;
}

export interface IValidMessage {
	isValid: Boolean;
	message: string;
}
