// Create a temporary database for cache
// (stored in memory, or a temp file if it gets too big)
// Read more here: https://www.sqlite.org/inmemorydb.html
const db = require("better-sqlite3")("");
const fs = require("fs");
const { resolve } = require("path");

// Initialize DB
const initDB = fs.readFileSync(resolve(__dirname, "init-db.sql"), "utf8");
db.exec(initDB);

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
const load = (username) => {
	const data = db
		.prepare("SELECT * FROM cache WHERE username = ?")
		.get(username);
	return data || null;
};

module.exports = { save, load };
