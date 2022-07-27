import { PhotoCreateDto } from './dto/photo-create.dto';
import { Photo } from './photo.entity';
import { IPhotoService } from './photo.service.interface';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { PhotoModel } from '@prisma/client';
import { PhotoGetDto } from './dto/photo-get.dto';
import { TYPES } from '../types';
import { IPhotosRepository } from './photos.repository.interface';

@injectable()
export class PhotoService implements IPhotoService {
	constructor(@inject(TYPES.PhotosRepository) private photoRepository: IPhotosRepository) {}

	async getPhoto({ id }: PhotoGetDto): Promise<PhotoModel | null> {
		return this.photoRepository.find(id);
	}

	async getPhotos(): Promise<PhotoModel[]> {
		return this.photoRepository.getAll();
	}

	async createPhoto(dto: PhotoCreateDto): Promise<PhotoModel | null> {
		const photo = new Photo(dto.url, dto.ownersEmail);
		photo.possition = dto.position;
		return this.photoRepository.create(photo);
	}
}
