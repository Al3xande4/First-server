import { inject, injectable } from 'inversify';
import { ILogger } from '../../logger/logger.interface';
import { TYPES } from '../../types';
import { IUserStorage } from './storage.interface';
import { User } from './user';
import 'reflect-metadata';

@injectable()
export class UsersStorage implements IUserStorage {
	private _users: User[];

	get users(): User[] {
		return this._users;
	}

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		this._users = [];
	}

	find(name: string): User | undefined {
		for (const user of this.users) {
			if (user.name === name) {
				this.logger.info('user was found');
				return user;
			}
		}

		return undefined;
	}

	insert(user: User): void {
		this._users.push(user);
		this.logger.info('user created');
	}

	valid(user: User): Boolean {
		return !this.find(user.name);
	}

	get(id: number): User {
		return this._users[id];
	}
}
