import { IUserStorage } from './storage/storage.interface';
import { User } from './user.entity';

export interface IUserStorageService {
	storage: IUserStorage;
	insertUser: (user: User) => boolean;
	findUser: (email: string) => User | null;
}
