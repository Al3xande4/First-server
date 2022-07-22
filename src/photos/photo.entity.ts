import { StorageUser } from '../users/storage/user';
import { IPossition } from './storage/photo';

export class Photo {
	constructor(private readonly _url: string, private readonly _owner?: StorageUser) {}
	id: number;
	possition: IPossition;

	get url(): string {
		return this._url;
	}

	get owner(): StorageUser | undefined {
		return this._owner;
	}
}
