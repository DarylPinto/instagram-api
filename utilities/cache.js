const sqlite = require("sqlite");
// const jdb = new sqlite.Database("cache/cache.db");

module.exports = (username, data) => {
	return new Promise((reslove, reject) => {
		try {
			
		} catch (err) {
			logError(err, `Attempted to cache data for profile "${username}"`);
		}
	});
};
