# Imdb playground

This playground is built and hosted on Vercel:
[https://imdb-playground.vercel.app](https://imdb-playground.vercel.app)

## Building
To download the tsv files and generate the database, run
```
npm run db-generate
```

To run the site locally, run:
```
npm run dev
```

## Steps and Thought process

### Generating the Database
For this, I wrote a little script in NodeJS to download IMDB's gzipped TSV files, unzip them, process them, and then save them locally. Usually I would do things the async/await + Promises way.
However, I wanted to experiment with Node's stream API, as I figured it would be better at handling the large files.

I then used a shell script to create a SQLite Database, and generate the records using the newly-imported TSV files.

> **Why NodeJS?**
> I mostly chose node because of familiarity! I knew I could whip something up fairly quickly. This entire step could have been a shell script but I didn't wan't to play around with that power. It also probably would have been easier to write this in Python, as the language is well equipped at doing large-scale repeated transformations, such as processing tsv files.


### Hosting the Database
I initially intended to create a static site, and serve the SQLite database on the client side. This was because I anticipated a lightweight database that wouldn't hog bandwidth. However, even with a bit of data pruning the resulting database was ~80MB. This would be far too large for any browser to load, and would quickly exchaust a free-tier bandwidth allowance on any hosting provider.

Because of this, I decided to host the db externally, and only fetch the records I needed using SQL queries. I found a hosting platform with a generous free tier called [SQLiteCloud](https://sqlitecloud.io/), and manually uploaded the database here. In future, I'd like to figure out how to automatically update the tables in the cloud using the same shell script in the previous step.

Next, In the SQLiteCloud app I created a role with READ access to all the tables in my database. I then created a User called `readimdb` and assigned it this role. I could then generate an API Key for this user.

### Creating the site
I decided to create the site using SvelteKit.
On relevant pages, the svelte server runs the SQL Query and returns the records. I then pass these records to the page template, which I then format and print on the page (e.g. as a chart or table). The API key for accessing the database is stored in an environment variable, so can be obscured on the hosting side.

> **Why SvelteKit?**
> Svelte is my front-end framework of choice, because *it just works*<sup>TM</sup>. It feels fairly close to vanilla JS but with a lot of sugar to make rendering components nice.
>SvelteKit also makes it easy to spin up static or dynamic sites by providing the server framework for you.

### Hosting the site
Because I was hosting the databse remotely, I would need to run the website on a server. This is to prevent putting the API key for the database in plaintext somewhere in the site source, which means it would be exposed to any malicious actor.

I chose to host this site on Vercel. In Vercel's configuration for this project, I set the environment variable for the API key. This gave the server access to the database, while obscuring the key from the front-end.

> **Why Vercel?**
> Mostly just because I knew that I could do what I needed for free :)

## Future considerations
* Adding pagination to the table browser
* Loading states for each page. There is a brief period of time where the query is being sent to the DB host. It would be good to add loading spinners, or disable the forms so that there is some feedback to the user.
* More styles
* Proper reusable nav bar. So far the links on the site have just been hard coded.
