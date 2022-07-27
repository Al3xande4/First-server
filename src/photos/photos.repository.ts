import { PhotoModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { Photo } from './photo.entity';
import { IPhotosRepository } from './photos.repository.interface';

@injectable()
export class PhotosRepository implements IPhotosRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ url, possition }: Photo): Promise<PhotoModel> {
		return this.prismaService.client.photoModel.create({
			data: {
				url,
				lat: possition.location.lat,
				lng: possition.location.lng,
				x: possition.rotation.x,
				y: possition.rotation.y,
				z: possition.rotation.z,
				direction: possition.direction,
			},
		});
	}

	async find(id: number): Promise<PhotoModel | null> {
		return this.prismaService.client.photoModel.findFirst({
			where: {
				id,
			},
		});
	}

	async getAll(): Promise<PhotoModel[]> {
		return this.prismaService.client.photoModel.findMany();
	}
}
