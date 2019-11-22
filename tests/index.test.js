const fetch = require("node-fetch");
const config = require("../api/config.json");
const appUrl = `http://localhost:${config.port}`;

jest.setTimeout(30000);

// Start api server before running any tests
let server;
beforeAll(() => (server = require("../api/index.js")));
afterAll(() => server.close());

// Sleep command necessary to prevent http 429 response
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * TESTS
 */

// Ensures API is running on localhost
test("API is running", async () => {
	const res = await fetch(appUrl);
	const data = await res.text();
	expect(data).toBeDefined();
});

// Ensures API properly responds to user requests
// TODO: Check each individual response field
test("Fetches Instagram users", async () => {
	const sleepDuration = config.rate_limit.window_ms;

	// Fetch data for `username`
	// and expect valid response
	const checkUser = async username => {
		let res = await fetch(`${appUrl}/${username}`);
		let data = await res.json();
		expect(data.username).toBe(username);
	};

	// Check if it fetches a handful of users
	await checkUser("cristiano");
	await sleep(sleepDuration);
	await checkUser("arianagrande");
	await sleep(sleepDuration);
	await checkUser("therock");
});

// Ensures API responds with 'Not Found error' for
// invalid usernames/non-existent users
test("404s invalid usernames", async () => {
	const sleepDuration = config.rate_limit.window_ms;

	// Fetch data for `username`
	// and expect 404
	const checkUser = async username => {
		let res = await fetch(`${appUrl}/${username}`);
		let data = await res.json();
		expect(data.status).toBe(404);
	};

	await checkUser("developer");
	await sleep(sleepDuration);
	await checkUser("explore");
	await sleep(sleepDuration);
	await checkUser("about");
	await sleep(sleepDuration);
	await checkUser("DEMO_USERNAME_TOO_LONG_TO_BE_REAL_TESTING_TESTING_123");
});

// Ensures API responds with 429 error
// when requestst are sent in too quickly
test("Rate limits requests", async () => {
	const { max_requests } = config.rate_limit;

	let statusCode = null;
	let i = 0;

	const checkUser = async () => {
		let res = await fetch(`${appUrl}/cristiano`);
		let data = await res.json();

		statusCode = data.status;

		i++;
		if (i <= max_requests) await checkUser();
	};

	await checkUser();

	expect(statusCode).toBe(429);
});
