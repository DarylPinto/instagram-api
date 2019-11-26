const scrape = require("./utilities/scrape.js");
const cache = require("./utilities/cache.js");
const logError = require("./utilities/log-error.js");
const config = require("./config.json");

module.exports = async (req, res) => {
	try {
		// Get username from request
		const username = req.query.username;
		// Check if data is already cached
		const cachedData = cache.load(username);

		// If it's already cached
		// check if cache is fresh enough (according to config.json)
		// If so, send the cached data instead of scraping instagram's live URL
		if (cachedData !== null) {
			const { status, response, time } = cachedData;
			const cacheAge = Math.floor((new Date() - new Date(time)) / 1000 / 60);
			if (cacheAge < config["cache_duration_minutes"]) {
				return res.status(status).json(JSON.parse(response));
			}
		}

		// If there's no cache or if the cached data is too old (according to config.json)
		// scrape instagram's live URL
		let data = await scrape(username);

		// If there's no data returned from the scraper
		// respond with 404
		if (data === null) {
			data = { status: 404, message: "Instagram User Not Found" };
			cache.save(username, 404, data);
			return res.status(404).json(data);
		}

		// Respond with scraped data
		cache.save(username, 200, data);
		return res.send(data);
	} catch (err) {
		// Respond with a 500 error if there's a server side exception
		const data = { status: 500, message: "Internal Server Error" };
		logError(err, err.message);
		return res.status(500).json(data);
	}
};
