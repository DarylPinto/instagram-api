// Explicitly disable rate limiting for the following tests
// Env variables must be strings
process.env.DISABLE_RATE_LIMIT = "1";

const app = require("../api/app.js");
const supertest = require("supertest");
const request = supertest(app);

describe("The API", () => {
	it("starts up", async (done) => {
		const res = await request.get("/");
		expect(res.text).toBeDefined();
		done();
	});

	it("can fetch valid Instagram users", async (done) => {
		const usernames = ["cristiano", "arianagrande", "therock", "leomessi"];
		const responses = await Promise.all(
			usernames.map((username) => request.get(`/${username}`))
		);

		responses.forEach((res, i) => {
			expect(res.body.username).toBe(usernames[i]);
		});

		done();
	});

	it("404s invalid usernames", async (done) => {
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

	it("has CORS enabled", async (done) => {
		const sampleUsername = "cristiano";
		const res = await request.get(`/${sampleUsername}`);
		const corsHeader = res.headers["access-control-allow-origin"];
		expect(corsHeader).toBe("*");
		done();
	});
});
