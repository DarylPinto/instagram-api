/* eslint-disable no-console */
const tz = { timeZone: "America/New_York" };

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
