const cleanTitleRow = function (record) {
	let [
		tconst,
		titleType,
		primaryTitle,
		originalTitle,
		isAdult,
		startYear,
		endYear,
		runTime,
		genres,
	] = record;

	if (titleType !== "movie") {
		return null;
	}
	startYear = startYear === "\\N" ? null : startYear;
	runTime = runTime === "\\N" ? null : runTime;

	return [tconst, primaryTitle, startYear, runTime];
};

export { cleanTitleRow };
