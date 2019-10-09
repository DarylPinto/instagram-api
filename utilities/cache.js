const db = require("better-sqlite3")("cache/cache.db", { fileMustExist: true });

process.on("exit", () => db.close());

const save = (username, status, response) => {
	const time = new Date().toISOString();
	response = JSON.stringify(response);
	db.prepare(
		"INSERT OR REPLACE INTO cache (username, status, response, time) VALUES (?, ?, ?, ?)"
	).run(username, status, response, time);
};

const load = username => {
	const data = db.prepare("SELECT * FROM cache WHERE username = ?").get(username);
	return data || null;
};

module.exports = { save, load };
