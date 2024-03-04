export interface IUserDto {
	username: string;
	password: string;
	confirmPassword: string;
}
export interface ICreateNewUserData {
	username: string;
	password: string;
}

export interface ICreatedUser {
	id: string;
	username: string;
	access_token: string;
}
