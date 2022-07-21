import { User } from '../../users/storage/user';

export class Photo {
	url: string;
	id: number;
	owner?: User;
	possition: IPossition;
}

interface IPossition {
	location: ILocation;
	rotation: IRotation;
	direction: number;
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
