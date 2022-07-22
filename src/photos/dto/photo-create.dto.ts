import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUrl, ValidateNested } from 'class-validator';
import { StorageUser } from '../../users/storage/user';
import { IPossition } from '../storage/photo';

class Location {
	@IsNotEmpty()
	lat: number;

	@IsNotEmpty()
	lng: number;
}

class Rotation {
	@IsNotEmpty()
	x: number;

	@IsNotEmpty()
	y: number;

	@IsNotEmpty()
	z: number;
}

class Possition{
	@IsNotEmpty({message: 'Position must contain a location'})
	@ValidateNested()
	@Type(() => Location)
	location: Location;

	@IsNotEmpty({message: 'Position must contain a rotation'})
	@ValidateNested()
	@Type(() => Rotation)
	rotation: Rotation;

	@IsNotEmpty({message: 'Position must contain a direction'})
	direction: number;
}


export class PhotoCreateDto {
	@IsNotEmpty({message: 'Url must be provided'})
	@IsUrl({message: 'Url must be a string'})
	url: string;

	owner?: StorageUser;

	@IsNotEmpty({message: 'Id must be provided'})
	@IsNumber({}, {message: 'Id must be number'})
	id: number;

	@ValidateNested()
	@Type(() => Possition)
	@IsNotEmpty({message: 'Possition must be provided'})
	position: Possition;
}

