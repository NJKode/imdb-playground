import type { PageServerLoad } from '../$types';
import { connectToDatabase } from '$lib/db';

export const load: PageServerLoad = async ({ url }) => {
	const database = connectToDatabase();

	const pageSize = 20;
	const sortBy = url.searchParams.get('sort_by') || 'startYear';
	const order = url.searchParams.get('order') || 'DESC';
	const offset = url.searchParams.get('page') || 0;

	let queryResults = await database.sql(
		`SELECT title, startYear, runTime, averageRating, numVotes FROM titles
		LEFT JOIN ratings ON titles.tconst = ratings.tconst
		WHERE averageRating IS NOT NULL
		AND numVotes > 10
		ORDER BY ${sortBy} ${order}
		LIMIT ${offset}, ${pageSize};`,
	);

	return {
		queryResults: queryResults.map((row: any) => row.getData()),
	};
};
