import type { PageServerLoad } from '../$types';
import { connectToDatabase } from '$lib/db';

export const load: PageServerLoad = async () => {
	const database = connectToDatabase();

	let queryResults = await database.sql`
		SELECT title, startYear, MAX(averageRating), numVotes from titles
		LEFT JOIN ratings ON titles.tconst = ratings.tconst
		WHERE numVotes > 10000
		group By startYear
		ORDER BY startYear`;

	return {
		queryResults: queryResults.map((row) => row.getData()),
	};
};
