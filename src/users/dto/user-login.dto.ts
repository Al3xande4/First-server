import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Email is not valid' })
	@IsNotEmpty({ message: 'Email must be provided' })
	email: string;

	@IsString({ message: 'Password must be a string' })
	@IsNotEmpty({ message: 'Password must be provided' })
	password: string;
}
