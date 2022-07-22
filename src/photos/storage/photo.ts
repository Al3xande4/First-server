import { IsNotEmpty } from 'class-validator';
import { StorageUser } from '../../users/storage/user';

export class StoragePhoto {
	url: string;
	id: number;
	owner?: StorageUser;
	possition: IPossition;
}

export interface IPossition {
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
