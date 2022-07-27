import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUrl, ValidateNested } from 'class-validator';

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

class Possition {
	@IsNotEmpty({ message: 'Position must contain a location' })
	@ValidateNested()
	@Type(() => Location)
	location: Location;

	@IsNotEmpty({ message: 'Position must contain a rotation' })
	@ValidateNested()
	@Type(() => Rotation)
	rotation: Rotation;

	@IsNotEmpty({ message: 'Position must contain a direction' })
	direction: number;
}

export class PhotoCreateDto {
	@IsNotEmpty({ message: 'Url must be provided' })
	@IsUrl({ message: 'Url must be a string' })
	url: string;

	ownersEmail?: string;

	@ValidateNested()
	@Type(() => Possition)
	@IsNotEmpty({ message: 'Possition must be provided' })
	position: Possition;
}
