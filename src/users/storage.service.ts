import { plainToClass } from 'class-transformer';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IUserStorageService } from './storage.service.interface';
import { IUserStorage } from './storage/storage.interface';
import { StorageUser } from './storage/user';
import { User } from './user.entity';
import 'reflect-metadata';

@injectable()
export class UserStorageService implements IUserStorageService {
	storage: IUserStorage;
	constructor(@inject(TYPES.UserStorage) storage: IUserStorage) {
		this.storage = storage;
	}

	insertUser(user: User): boolean {
		const storageUser = new StorageUser(user.email, user.name, user.password);
		if (this.storage.valid(storageUser)) {
			this.storage.insert(storageUser);
			return true;
		}
		return false;
	}
	findUser(email: string): User | null {
		const storageUser = this.storage.find(email);
		if (!storageUser) {
			return null;
		}
		const user = plainToClass(User, storageUser);
		return user;
	}
}
