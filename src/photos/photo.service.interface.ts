import { PhotoCreateDto } from './dto/photo-create.dto';
import { PhotoGetDto } from './dto/photo-get.dto';
import { Photo } from './photo.entity';

export interface IPhotoService {
	createPhoto: (dto: PhotoCreateDto) => Photo | null;
}
