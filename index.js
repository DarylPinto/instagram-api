const express = require("express");
const parse = require("./utilities/scrape.js");
const logError = require("./utilities/logError.js");

const app = express();
const port = 3000;

app.get("/api/:username", async (req, res) => {
	try {
		const { username } = req.params;
		const data = await parse(username);

		if (data.status) {
			return res.status(data.status).json(data);
		}

		return res.send(data);
	} catch (err) {
		// Show 404 if user not found
		if (err.status === 404) return res.status(404).json(err);

		// If there's a server-side exception
		// Log the stack and respond with a 500 error
		// console.error(`[${new Date().toUTCString()}]: ${err.stack}`);
		logError(err, `Attempted to get profile for ${username}`);
		return res.status(500).json({
			status: 500,
			message: err.message
		});
	}
});

app.get("/sample", (req, res) => {
	res.json(sample);
});

app.listen(port, () => {
	console.log(`Instagram API running on http://localhost:${port}!`);
});
