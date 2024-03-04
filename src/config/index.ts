export default () => ({
	secretKey: process.env.SECRET_KEY,
	secretRefreshKey: process.env.SECRET_REFRESH_KEY,
	expiresToken: process.env.EXPIRES_TOKEN,
	expiresRefreshToken: process.env.EXPIRES_REFRESH_TOKEN,
	saltRounds: process.env.SALT_ROUNDS,
	port: process.env.PORT,
	dbPort: process.env.DB_PORT,
	dbType: process.env.DB_TYPE,
	dbHost: process.env.DB_HOST,
	dbUser: process.env.DB_USER,
	dbPassword: process.env.DB_PASSWORD,
	dbName: process.env.DB_NAME,
	clientApi: process.env.CLIENT_API,
});
