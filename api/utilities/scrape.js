const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const logError = require("../utilities/log-error.js");

module.exports = (username) => {
	return new Promise(async (resolve, reject) => {
		try {
			// Fetch page
			let res = await fetch(`http://www.instagram.com/${username}`);
			let body = await res.text();

			// Ensure it's actually a user's profile page
			if (!body.includes("ProfilePage") || body.includes("Page Not Found")) {
				return resolve(null);
			}

			// Parse javascript from  bottom of page response
			let jsdom = new JSDOM(body, { runScripts: "dangerously" });
			let entryData = jsdom.window._sharedData.entry_data;

			// Ensure Instagram's `_sharedData.entry_data` object actually
			// has a `ProfilePage` property to prevent false positives
			if (!entryData.ProfilePage) return resolve(null);

			let user = entryData.ProfilePage[0].graphql.user;

			// Format posts array
			let posts = user.edge_owner_to_timeline_media.edges
				.map((edge) => edge.node)
				.map((post) => ({
					id: post.shortcode,
					link: `https://www.instagram.com/p/${post.shortcode}/`,
					image: post.display_url,
					thumbnail: {
						small: post.thumbnail_resources[1].src,
						large: post.thumbnail_src,
					},
					caption:
						post.edge_media_to_caption.edges.length > 0
							? post.edge_media_to_caption.edges[0].node.text
							: null,
					likes: post.edge_liked_by.count,
					comments: post.edge_media_to_comment.count,
					is_video: post.is_video,
					location: post.location ? post.location.name : null,
					date: new Date(post.taken_at_timestamp * 1000).toISOString(),
				}));

			// Format response object to send out
			return resolve({
				username: user.username,
				link: `https://www.instagram.com/${username}/`,
				profile_pic: {
					small: user.profile_pic_url,
					large: user.profile_pic_url_hd,
				},
				verified: user.is_verified,
				private: user.is_private,
				name: user.full_name,
				bio: user.biography === "" ? null : user.biography,
				website: user.external_url,
				postCount: user.edge_owner_to_timeline_media.count,
				followers: user.edge_followed_by.count,
				following: user.edge_follow.count,
				recentPosts: posts,
			});
		} catch (err) {
			logError(err, `Attempted to scrape data for profile "${username}"`);
			return reject(err);
		}
	});
};
