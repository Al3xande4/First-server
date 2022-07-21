import { ILogger } from '../../logger/logger.interface';
import { Photo } from './photo';
import { IPhotoStorage, IValidMessage } from './storage.interface';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';

@injectable()
export class PhotosStorage implements IPhotoStorage {
	private _photos: Photo[];

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		this._photos = [];
	}

	get photos(): Photo[] {
		return this._photos;
	}

	get(id: number): Photo | undefined {
		for (const photo of this._photos) {
			if (photo.id == id) {
				return photo;
			}
		}
		return undefined;
	}

	insert(photo: Photo): void {
		this._photos.push(photo);
	}

	valid(photo: Photo): IValidMessage {
		if (!photo.id) {
			return { isValid: false, message: 'Photo must have an id' };
		}

		if (!photo.url) {
			return { isValid: false, message: 'Photo must have an url' };
		}

		if (this.get(photo.id)) {
			return { isValid: false, message: 'Photo already exists' };
		}

		if (!photo.possition) {
			return { isValid: false, message: 'Photo must have a possition' };
		}

		return { isValid: true, message: 'Photo successfully created' };
	}
}
