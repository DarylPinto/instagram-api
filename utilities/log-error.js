const tz = { timeZone: "America/New_York" };

module.exports = (err, info = "No additional info") => {
	console.error(`
		===============================
		Time: ${new Date().toLocaleString("en-CA", tz)}
		Info: ${info}
		-- Stack Trace Below --
		${err.stack}
	`.trim().replace(/\t/g, ""));
};
