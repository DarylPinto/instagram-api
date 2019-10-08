const express = require("express");
const scrape = require("./utilities/scrape.js");
const cache = require("./utilities/cache.js");
const config = require("./config.json");

const app = express();
const port = 3000;

app.get("/:username", async (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	let username, cached;

	try {
		// Get username from request
		username = req.params.username;
		// Check if data is already cached
		cached = await cache.load(username);

		// If it's already cached
		// check if cache is fresh enough (according to config.json)
		// If so, send the cached data instead of scraping instagram's live URL
		if (cached) {
			const { status, response, time } = cached;
			const cacheAge = Math.floor((new Date() - new Date(time)) / 1000 / 60);
			if (cacheAge < config["max_cache_time"]) {
				return res.status(status).json(JSON.parse(response));
			}
		}

		// If there's no cache or if the cached data is too old (according to config.json)
		// scrape instagram's live URL
		const data = await scrape(username);

		// If there's a status other than 200, data.status will exist.
		// Send the response with this correct status
		if (data.status) {
			cache.save(username, data.status, data);
			return res.status(data.status).json(data);
		}

		// Respond with scraped data
		cache.save(username, 200, data);
		return res.send(data);
	} catch (err) {	
		// Show 404 if user not found
		if (err.status === 404) {
			let data = { status: 404, message: "User Not Found" };
			cache.save(username, 404, data);
			return res.status(404).json(data);
		}

		// If there's a server-side exception
		// respond with a 500 error
		let data = { status: 500, message: err.message };
		cache.save(username, 500, data);
		return res.status(500).json(data);
	}
});

app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(port, () => {
	console.log(`Instagram API running on http://localhost:${port}!`);
});
