import { UserModel } from '@prisma/client';
import { Container } from 'inversify';
import 'reflect-metadata';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUsersRepository } from './users.repository.interface';
import { UserService } from './user.service';
import { IUserService } from './user.service.interface';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
	getAll: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersService = container.get<IUserService>(TYPES.UserService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
});

let createdUser: UserModel | null;

const CONFIG_SALT_VALUE = '1';

const USER_ID = 1;
const USER_PASS = '1234';
const USER_EMAIL = 'a@a.com';

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce(CONFIG_SALT_VALUE);
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: USER_ID,
			}),
		);

		createdUser = await usersService.createUser({
			email: USER_EMAIL,
			password: USER_PASS,
			name: 'a',
		});

		expect(createdUser?.id).toEqual(USER_ID);
		expect(createdUser?.password).not.toEqual(USER_PASS);
	});
	it('validateUser - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const res = await usersService.validateUser({
			email: USER_EMAIL,
			password: USER_PASS,
		});
		expect(res).toBeTruthy();
	});

	it('validateUser - error(wrong pass)', async () => {
		const WRONG_PASS = '2';
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const res = await usersService.validateUser({
			email: USER_EMAIL,
			password: WRONG_PASS,
		});
		expect(res).toBeFalsy();
	});

	it('validateUser - error(no such user)', async () => {
		const WRONG_EMAIL = 'b@b.com';
		usersRepository.find = jest.fn().mockReturnValueOnce(null);

		const res = await usersService.validateUser({
			email: WRONG_EMAIL,
			password: USER_PASS,
		});
		expect(res).toBeFalsy();
	});
});
