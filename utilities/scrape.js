const { Builder, By } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");

const baseUrl = "https://www.instagram.com";

module.exports = username => {
	return new Promise(async (resolve, reject) => {
		let driver;

		try {
			// Set up webdriver
			const options = new firefox.Options()
				// .setBinary("resources/geckodriver")
				.headless();

			driver = await new Builder()
				.forBrowser("firefox")
				.setFirefoxOptions(options)
				.build();

			// Go to public instagram page
			await driver.get(`${baseUrl}/${username}`);

			// Private account
			const main = await driver.findElement(By.css("main"));
			const mainText = await main.getText();
			if (mainText.includes("This Account is Private")) {
				driver.quit();
				return resolve({
					status: 401,
					body: { message: "This Account is Private" }
				});
			}

			// name
			let h1s = await driver.findElements(By.css("h1"));
			let name = await h1s[1].getText();

			// verified
			let verified;
			try {
				await driver.findElement(By.css("span[title='Verified']"));
				verified = true;
			} catch (err) {
				verified = false;
			}

			// description
			let description = await driver.findElement(By.css("header section div br ~ span"));
			description = await description.getText();

			// stats
			let postCount = await driver.findElement(By.css("header section ul li:nth-of-type(1) a span"));
			postCount = await postCount.getText();

			let followerCount = await driver.findElement(By.css("header section ul li:nth-of-type(2) a span"));
			followerCount = await followerCount.getText();

			let followingCount = await driver.findElement(By.css("header section ul li:nth-of-type(3) a span"));
			followingCount = await followingCount.getText();

			// posts
			let posts = await driver.findElements(
				By.css("a[href^='/p/'] img[srcset]")
			);
			posts = await Promise.all(posts.map(post => post.getAttribute("srcset")));

			posts = posts.reduce((r, e) => {
				let post = {};
				let sizes = e.split(",").map(size => size.trim());
				sizes.forEach(size => {
					let x = size.split(" ");
					post[x[1]] = x[0];
				});
				r.push(post);
				return r;
			}, []);

			// driver.quit();
			return resolve({
				username,
				verified,	
				name,
				description,
				postCount,
				followerCount,
				followingCount,
				posts
			});
		} catch (err) {
			if (driver) driver.quit();
			return reject(err);
		}
	});
};
