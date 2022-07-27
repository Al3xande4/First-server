import { PhotoCreateDto } from './dto/photo-create.dto';
import { PhotoGetDto } from './dto/photo-get.dto';
import { PhotoModel } from '@prisma/client';

export interface IPhotoService {
	createPhoto: (dto: PhotoCreateDto) => Promise<PhotoModel | null>;
	getPhoto: (dto: PhotoGetDto) => Promise<PhotoModel | null>;
	getPhotos: () => Promise<PhotoModel[]>;
}
