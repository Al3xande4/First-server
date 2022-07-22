import { ILogger } from '../../logger/logger.interface';
import { StoragePhoto } from './photo';
import { IPhotoStorage } from './storage.interface';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';

@injectable()
export class PhotosStorage implements IPhotoStorage {
	private _photos: StoragePhoto[];

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		this._photos = [];
	}

	get photos(): StoragePhoto[] {
		return this._photos;
	}

	get(id: number): StoragePhoto | null {
		for (const photo of this._photos) {
			if (photo.id == id) {
				return photo;
			}
		}
		return null;
	}

	insert(photo: StoragePhoto): void {
		this._photos.push(photo);
	}

	valid(photo: StoragePhoto): boolean {
		return !Boolean(this.get(photo.id));
	}
}
