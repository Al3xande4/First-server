import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';
import { hash } from 'bcryptjs';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class UserService implements IUserService {
	async createUser(dto: UserRegisterDto): Promise<User | null> {
		const user = new User(dto.email, dto.name);
		user.setPassword(dto.password);

		return user;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}

	async checkPassword(hashedPass: string, notHashed: string): Promise<boolean> {
		const hashed = await hash(notHashed, 10);
		return hashed == hashedPass;
	}
}
