import { inject, injectable } from 'inversify';
import { ILogger } from '../../logger/logger.interface';
import { TYPES } from '../../types';
import { IUserStorage } from './storage.interface';
import { StorageUser } from './user';
import 'reflect-metadata';

@injectable()
export class UsersStorage implements IUserStorage {
	private _users: StorageUser[];

	get users(): StorageUser[] {
		return this._users;
	}

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		this._users = [];
	}

	find(email: string): StorageUser | null {
		for (const user of this.users) {
			if (user.email === email) {
				this.logger.info('user was found');
				return user;
			}
		}

		return null;
	}

	insert(user: StorageUser): void {
		this._users.push(user);
		this.logger.info('user created');
	}

	valid(user: StorageUser): Boolean {
		return !this.find(user.email);
	}

	get(id: number): StorageUser {
		return this._users[id];
	}
}
