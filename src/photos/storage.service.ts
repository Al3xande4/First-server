import { Photo } from './photo.entity';
import { IPhotoStorageService } from './storage.service.interface';
import { StoragePhoto } from './storage/photo';
import { IPhotoStorage } from './storage/storage.interface';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class PhotoStorageService implements IPhotoStorageService {

    constructor(@inject(TYPES.PhotoStorage) readonly storage: IPhotoStorage) {}

	insertPhoto(photo: Photo): boolean {
		const storagePhoto = new StoragePhoto();
		storagePhoto.id = photo.id;
		storagePhoto.url = photo.url;
		storagePhoto.possition = photo.possition;
		storagePhoto.owner = photo.owner;

		if (!this.storage.valid(storagePhoto)) {
			return false;
		}
		this.storage.insert(storagePhoto);
		return true;
	}

	findPhoto(id: number): Photo | null {
		const storagePhoto = this.storage.get(id);
		if (!storagePhoto) {
			return null;
		}
		const photo = new Photo(storagePhoto.url, storagePhoto.owner);
		photo.id = storagePhoto.id;
		photo.possition = storagePhoto.possition;
		return photo;
	}
}
