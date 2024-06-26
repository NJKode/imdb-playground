import { createGunzip } from 'zlib';
import { createWriteStream } from 'fs';
import fetch from 'node-fetch';
import { exec } from 'child_process';
import { parse } from 'csv-parse';
import { transform } from 'stream-transform';
import { stringify } from 'csv-stringify';
import { cleanTitleRow } from './lib/transformers.js'

// "https://datasets.imdbws.com/name.basics.tsv.gz",
//  "https://datasets.imdbws.com/title.akas.tsv.gz",
// 'https://datasets.imdbws.com/title.basics.tsv.gz',
//  "https://datasets.imdbws.com/title.crew.tsv.gz",
//  "https://datasets.imdbws.com/title.episode.tsv.gz",
//  "https://datasets.imdbws.com/title.principals.tsv.gz",
// 'https://datasets.imdbws.com/title.ratings.tsv.gz',


// I added this object as I had intended to parse/process more of the tables,
// thus possibly needing a transformation function per table
const tableInfo = {
	titles: {
		url: 'https://datasets.imdbws.com/title.basics.tsv.gz',
		transformFunction: cleanTitleRow,
	},
	ratings: {
		url: 'https://datasets.imdbws.com/title.ratings.tsv.gz',
	},
};

const fetchData = (url) => {
	return fetch(url, {
		headers: {
			method: 'GET',
		},
	});
};

const processData = async () => {
	const processes = Object.entries(tableInfo).map(([tableName, { url, transformFunction }]) => {
		return new Promise((resolve, reject) => {
			// This might fail if the folder doesnt exist, woops.
			// needs a fs.stat -> fs.mkdir
			const fileName = `db/data/${tableName}.tsv`;
			const writeStream = createWriteStream(fileName);
			writeStream.on('finish', () => {
				console.log(`Processed ${tableName}`);
				resolve();
			});
			// Ensure the file is created before running by listening for the 'open' event
			writeStream.on('open', () => {
				fetchData(url)
				.then((response) => {
					const parser = parse({
						delimiter: '\t',
						relax_quotes: true,
						from: 2,
						skip_records_with_error: true,
					});

					transformFunction ||= (record) => record;
					const transformer = transform(transformFunction);

					const stringifier = stringify({
						delimiter: '\t',
					});

					// ye olde pipe
					response.body
						?.pipe(createGunzip())
						.pipe(parser)
						.pipe(transformer)
						.pipe(stringifier)
						.pipe(writeStream);

				})
				.catch((err) => {
					reject(err);
				});
			})
		});
	});

	// Run this 'asynchrously', and retun when all of the promises are fulfilled
	await Promise.all(processes);
};

(async function main(...args) {
	await processData();
	exec('sh db/db-generate.sh', (error, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);
		if (error !== null) {
			console.log(`exec error: ${error}`);
		}
	});
})();
