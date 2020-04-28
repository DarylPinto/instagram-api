const fetch = require("node-fetch");
const nowUri = "https://insta-api.now.sh";
const nowApiBaseUri = "https://insta-api.now.sh/api";

jest.setTimeout(20000);

// Ensures API is running on localhost
test("Is live", async done => {
	const res = await fetch(nowUri);
	expect(res.text).toBeDefined();
	done();
});

// Ensures API properly responds to user requests
// TODO: Check each individual response field
test("Fetches Instagram users", async done => {
	const usernames = ["cristiano"];//, "arianagrande", "therock", "leomessi"];
	let responses = await Promise.all(
		usernames.map(username => fetch(`${nowApiBaseUri}/${username}`))
	);

	responses = await Promise.all(responses.map(res => res.json()));

	responses.forEach((res, i) => {
		expect(res.username).toBe(usernames[i]);
	});

	done();
});

// Ensures API responds with 'Not Found error' for
// invalid usernames/non-existent users
test("404s invalid usernames", async done => {
	const usernames = [
		"developer",
		"explore",
		"about",
		"DEMO_USERNAME_TOO_LONG_TO_BE_REAL_TESTING_TESTING_123"
	];

	let responses = await Promise.all(
		usernames.map(username => fetch(`${nowApiBaseUri}/${username}`))
	);

	responses = await Promise.all(responses.map(res => res.json()));

	responses.forEach(res => expect(res.status).toBe(404));

	done();
});
