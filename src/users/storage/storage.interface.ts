import { User } from './user';

export interface IUserStorage {
	find: (name: string) => User | undefined;
	insert: (user: User) => void;
	valid: (user: User) => Boolean;
	get users(): User[];
	get: (id: number) => User | undefined;
}
