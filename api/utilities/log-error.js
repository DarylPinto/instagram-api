/* eslint-disable no-console */
const config = require("../config.json");
const tz = { timeZone: config["logs_timezone"] };

module.exports = (err, info = "No additional info") => {
	console.error(`
		===============================
		[ ERROR ]
		Time: ${new Date().toLocaleString("en-CA", tz)}
		Info: ${info}
		-- Stack Trace Below --
		${err.stack}
	`.trim().replace(/\t/g, ""));
};
