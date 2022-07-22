import { Photo } from './photo.entity';
import { IPhotoStorage } from './storage/storage.interface';

export interface IPhotoStorageService {
	readonly storage: IPhotoStorage;
	insertPhoto: (photo: Photo) => boolean;
	findPhoto: (id: number) => Photo | null;
}
