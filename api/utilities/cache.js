const db = require("better-sqlite3")("");

// Initialize temporary database for cache
db.exec(`
PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION; 
CREATE TABLE cache 
( 
	username TEXT UNIQUE NOT NULL PRIMARY KEY, 
	status INTEGER NOT NULL DEFAULT (200), 
	response TEXT NOT NULL, 
	time TEXT NOT NULL 
);
COMMIT TRANSACTION;
PRAGMA foreign_keys = ON;
`);

process.on("exit", () => db.close());

// Save response to cache
const save = (username, status, response) => {
	const time = new Date().toISOString();
	response = JSON.stringify(response);
	db.prepare(
		"INSERT OR REPLACE INTO cache (username, status, response, time) VALUES (?, ?, ?, ?)"
	).run(username, status, response, time);
};

// Load response from cache
const load = username => {
	const data = db
		.prepare("SELECT * FROM cache WHERE username = ?")
		.get(username);
	return data || null;
};

module.exports = { save, load };
