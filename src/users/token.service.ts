import { ITokenService } from './token.service.interface';
import jwt from 'jsonwebtoken';
import 'reflect-metadata';
import { injectable } from 'inversify';

@injectable()
export class TokenService implements ITokenService {
	saveToken(key: string): string | null {
		const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
		if (ACCESS_TOKEN != undefined) {
			const token = jwt.sign(JSON.stringify(key), ACCESS_TOKEN);
			return token;
		}
		return null;
	}
}
