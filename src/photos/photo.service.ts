import { PhotoCreateDto } from './dto/photo-create.dto';
import { Photo } from './photo.entity';
import { IPhotoService } from './photo.service.interface';
import 'reflect-metadata';
import { injectable } from 'inversify';

@injectable()
export class PhotoService implements IPhotoService {
	createPhoto(dto: PhotoCreateDto): Photo | null {
		const photo = new Photo(dto.url, dto.owner);
        photo.id = dto.id;
        photo.possition = dto.position;
		return photo;
	}
}
