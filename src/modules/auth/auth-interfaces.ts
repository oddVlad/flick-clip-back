export interface ILoginDTO {
	username: string;
	password: string;
}

export interface IClientInfo {
	id: string;
	name: string;
}

export interface ILoginResponse {
	user: IClientInfo;
	token: IToken<string>;
}

export interface ISignUpDTO {
	username: string;
	password: string;
	passwordConfirm: string;
}

export interface ISignUpResponse {
	user: IClientInfo;
	token: IToken<string>;
}

export interface IJwtPayload {
	sub: string;
	username: string;
}

export interface ILogoutResponse extends IToken<null> {}

export interface IToken<T> {
	accessToken: T;
	refreshToken: T;
}
