export class Photo {
	constructor(private readonly _url: string, private readonly _ownersEmail?: string) {}
	possition: IPossition;

	get url(): string {
		return this._url;
	}

	get ownersEmail(): string | undefined {
		return this._ownersEmail;
	}
}

interface ILocation {
	lat: number;
	lng: number;
}

interface IRotation {
	x: number;
	y: number;
	z: number;
}

interface IPossition {
	location: ILocation;
	rotation: IRotation;
	direction: number;
}
