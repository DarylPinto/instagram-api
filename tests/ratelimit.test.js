const app = require("../api/app.js");
const supertest = require("supertest");
const request = supertest(app);

// Ensures API responds with 429 error
// when requests are sent in too quickly
test("Rate limits requests", async done => {
	const usernames = ["cristiano", "arianagrande", "therock", "leomessi"];
	let responses = await Promise.all(
		usernames.map(username => request.get(`/${username}`))
	);

	// Ensure some (at least 1) of the responses came back with a 429
	responses = responses.map(res => res.body);
	const successfullyLimited = responses.some(data => data.status === 429);

	expect(successfullyLimited).toBe(true);

	done();
});
