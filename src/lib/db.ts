import { env } from '$env/dynamic/private';
import { Database } from '@sqlitecloud/drivers';

export const connectToDatabase = () => {
	const apiKey = env.SQLITE_CLOUD_API_KEY;
	const dbUrl = `sqlitecloud://crbivw78ik.sqlite.cloud:8860?apikey=${apiKey}`;
	const database = new Database({
		connectionstring: dbUrl,
		database: 'IMDB',
	});

	return database;
};
