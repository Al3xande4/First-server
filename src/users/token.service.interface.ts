export interface ITokenService {
	saveToken: (key: string) => string | null;
}
