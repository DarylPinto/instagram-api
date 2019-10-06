const express = require("express");
const cheerio = require("cheerio");
const scrape = require("./utilities/scrape.js");

const app = express();
const port = 3000;

app.get("/api/:username", async (req, res) => {
	try {
		const { username } = req.params;
		const json = await scrape(username);

		if (json.status) {
			return res.status(json.status).json({
				status: json.status,
				...json.body
			});
		}

		return res.json(json);
	}
	// If there's a server-side exception
	// Log the stack and respond with a 500 error
	catch (err) {
		console.error(`[${new Date().toUTCString()}]: ${err.stack}`);
		return res.status(500).json({
			status: 500,
			message: err.message
		});
	}
});

app.listen(port, () => {
	console.log(`Running on port ${port}!`);
});
