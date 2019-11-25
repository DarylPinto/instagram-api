const app = require("./app.js");
const config = require("./config.json");

app.listen(config["port"], () => {
	// eslint-disable-next-line no-console
	console.log(`Instagram API running on http://localhost:${config["port"]}!`);
});
