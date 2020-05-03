// Explicitly disable rate limiting for the following tests
// Env variables must be strings
process.env.DISABLE_RATE_LIMIT = "1";

const app = require("../api/app.js");
const supertest = require("supertest");
const request = supertest(app);

// Ensures API is running on localhost
test("Starts up", async (done) => {
	const res = await request.get("/");
	expect(res.text).toBeDefined();
	done();
});

// Ensures API properly responds to user requests
// TODO: Check each individual response field
test("Fetches Instagram users", async (done) => {
	const usernames = ["cristiano", "arianagrande", "therock", "leomessi"];
	const responses = await Promise.all(
		usernames.map((username) => request.get(`/${username}`))
	);

	responses.forEach((res, i) => {
		expect(res.body.username).toBe(usernames[i]);
	});

	done();
});

// Ensures API responds with 'Not Found error' for
// invalid usernames/non-existent users
test("404s invalid usernames", async (done) => {
	const usernames = [
		"developer",
		"explore",
		"about",
		"DEMO_USERNAME_TOO_LONG_TO_BE_REAL_TESTING_TESTING_123",
	];

	const responses = await Promise.all(
		usernames.map((username) => request.get(`/${username}`))
	);

	responses.forEach((res) => expect(res.body.status).toBe(404));

	done();
});
