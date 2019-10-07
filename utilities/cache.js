const sqlite = require("sqlite");
const dbPromise = sqlite.open("./cache/cache.db", { Promise });
const logError = require("../utilities/log-error.js");

const save = (username, status, data) => {
	return new Promise(async (resolve, reject) => {
		const db = await dbPromise;
		const now = new Date();
		const timestamp = now.toISOString();

		try {
			await db.run(
				"INSERT INTO cache (username, status, response, time) VALUES (?, ?, ?, ?)",
				[username, status, JSON.stringify(data), timestamp]
			);
			return resolve(true);
		} catch (err) {
			// If record already exists, update it
			if (err.errno === 19) {
				await db.run(
					"UPDATE cache SET status = ?, response = ?, time = ? WHERE username = ?",
					[status, JSON.stringify(data), timestamp, username]
				);
				return resolve(true);
			}

			// Otherwise log error normally and reject
			logError(err, `Attempted to save cache data for "${username}"`);
			return reject(err);
		}
	});
};

const load = username => {
	return new Promise(async (resolve, reject) => {
		const db = await dbPromise;

		try {
			let data = await db.get("SELECT * FROM cache WHERE username = ?", [
				username
			]);
			data = typeof data === "undefined" ? null : data;
			return resolve(data);
		} catch (err) {
			logError(err, `Attempted to load cache data for "${username}"`);
			return reject(err);
		}
	});
};

module.exports = { save, load };
