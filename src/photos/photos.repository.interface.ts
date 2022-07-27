import { PhotoModel } from '@prisma/client';
import { Photo } from './photo.entity';

export interface IPhotosRepository {
	create: (photo: Photo) => Promise<PhotoModel>;
	find: (id: number) => Promise<PhotoModel | null>;
	getAll: () => Promise<PhotoModel[]>;
}
