/* eslint-disable jest/no-test-callback */
const fetch = require("node-fetch");
const nowUri = "https://insta-api.now.sh";
const nowApiBaseUri = "https://insta-api.now.sh/api";

jest.setTimeout(20000);

describe("The Prod API", () => {
	it("is live", async (done) => {
		const res = await fetch(nowUri);
		const html = await res.text();
		expect(html).toBeDefined();
		done();
	});

	it("can fetch valid Instagram users", async (done) => {
		const usernames = ["cristiano", "arianagrande", "therock", "leomessi"];
		let responses = await Promise.all(
			usernames.map((username) => fetch(`${nowApiBaseUri}/${username}`))
		);

		responses = await Promise.all(responses.map((res) => res.json()));

		responses = responses.map((res) => res.username);

		expect(JSON.stringify(responses)).toBe(JSON.stringify(usernames));

		done();
	});

	it("404s invalid usernames", async (done) => {
		const usernames = [
			"developer",
			"explore",
			"about",
			"DEMO_USERNAME_TOO_LONG_TO_BE_REAL_TESTING_TESTING_123",
		];

		let responses = await Promise.all(
			usernames.map((username) => fetch(`${nowApiBaseUri}/${username}`))
		);

		responses = await Promise.all(responses.map((res) => res.json()));

		responses.forEach((res) => expect(res.status).toBe(404));

		done();
	});

	it("has CORS enabled", async (done) => {
		const sampleUsername = "cristiano";
		const res = await fetch(`${nowApiBaseUri}/${sampleUsername}`);
		const corsHeader = res.headers.get("access-control-allow-origin");
		expect(corsHeader).toBe("*");
		done();
	});
});
