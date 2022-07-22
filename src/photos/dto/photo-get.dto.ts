import { IsNotEmpty } from 'class-validator';

export class PhotoGetDto {
	@IsNotEmpty({ message: 'Id must be provided' })
	id: number;
}
