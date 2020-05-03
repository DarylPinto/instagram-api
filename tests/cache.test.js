const cache = require("../api/utilities/cache.js");

describe("The Cache", () => {
	it("saves/loads correctly", () => {
		const testUser = "CACHE_TEST_USERNAME";
		cache.save(testUser, 200, { sample: "data" });

		const data = cache.load(testUser);
		const res = JSON.parse(data.response);

		expect(data.username).toBe(testUser);
		expect(data.status).toBe(200);
		expect(res.sample).toBe("data");
	});
});
