import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsNotEmpty({ message: 'You must provide an email' })
	@IsEmail({}, { message: 'Email is not valid' })
	email: string;

	@IsNotEmpty({ message: 'You must provide a pass' })
	@IsString({ message: 'Password must be a string' })
	password: string;

	@IsNotEmpty({ message: 'You must provide a name' })
	@IsString({ message: 'Name must be a string' })
	name: string;
}
