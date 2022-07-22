import { StorageUser } from './user';

export interface IUserStorage {
	find: (email: string) => StorageUser | null;
	insert: (user: StorageUser) => void;
	valid: (user: StorageUser) => Boolean;
	get users(): StorageUser[];
	get: (id: number) => StorageUser | null;
}
