export class StorageUser {
	constructor(
		private readonly _email: string,
		private readonly _name: string,
		private readonly _password: string,
	) {}

	get password(): string {
		return this._password;
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	id?: number;
}
