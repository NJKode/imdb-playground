sqlite3 db/IMDB.db <<EOF
drop table if exists ratings;
drop table if exists titles;
create table titles(tconst text primary key, title text, startYear int, runTime int);
create table ratings(tconst REFERENCES titles(tconst), averageRating real, numVotes int, id INTEGER primary key);
create temporary table ratings_temp(tconst text, averageRating real, numVotes int);
.mode tabs
.import db/data/titles.tsv titles
.import db/data/ratings.tsv ratings_temp
insert into ratings(tconst, averageRating, numVotes) select tconst, averageRating, numVotes from ratings_temp;
EOF
