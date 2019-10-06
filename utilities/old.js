const puppeteer = require("puppeteer");

module.exports = url =>
	new Promise(async (resolve, reject) => {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(url, { waitUntil: "networkidle2" });
		const dom = await page.evaluate(() => {
			// return document.body.innerHTML;
			return Array.from(document.querySelectorAll("a[href^='/p/']"))
				.map(el => el.getAttribute("href"));
		});
		await browser.close();

		resolve(dom);		
	});
