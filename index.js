const express = require("express");
const rateLimit = require("express-rate-limit");
const scrape = require("./utilities/scrape.js");
const cache = require("./utilities/cache.js");
const logError = require("./utilities/log-error.js");
const config = require("./config.json");

process.on("unhandledRejection", err => logError(err, "Unhandled Rejection"));

const app = express();
const port = 3000;
const limit = rateLimit({
	windowMs: config["rate_limit"]["window_ms"],
	max: config["rate_limit"]["max_requests"],
	message: { status: 429, message: "You are sending requests too quickly" }
});

app.get("/:username", limit, async (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	let username;

	try {
		// Get username from request
		username = req.params.username;
		// Check if data is already cached
		let cached = cache.load(username);

		// If it's already cached
		// check if cache is fresh enough (according to config.json)
		// If so, send the cached data instead of scraping instagram's live URL
		if (cached) {
			const { status, response, time } = cached;
			const cacheAge = Math.floor((new Date() - new Date(time)) / 1000 / 60);
			if (cacheAge < config["cache_duration_minutes"]) {
				return res.status(status).json(JSON.parse(response));
			}
		}

		// If there's no cache or if the cached data is too old (according to config.json)
		// scrape instagram's live URL
		const data = await scrape(username);

		// If there's no data returned from the scraper
		// respond with 404
		if (data === null) {
			let data = { status: 404, message: "Instagram User Not Found" };
			cache.save(username, 404, data);
			return res.status(404).json(data);
		}

		// Respond with scraped data
		cache.save(username, 200, data);
		return res.send(data);
	} catch (err) {
		// Respond with a 500 error if there's a server side exception
		let data = { status: 500, message: "Internal Server Error" };
		logError(err, err.message);
		return res.status(500).json(data);
	}
});

// Landing page/tutorial
app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(port, () => {
	console.log(`Instagram API running on http://localhost:${port}!`);
});
