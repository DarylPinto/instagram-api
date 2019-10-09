const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const logError = require("../utilities/log-error.js");

module.exports = username => {
	return new Promise(async (resolve, reject) => {
		let res, body, jsdom, user;

		try {
			// Fetch page
			res = await fetch(`http://www.instagram.com/${username}`);
			body = await res.text();

			// Ensure it's actually a user's profile page
			if (!body.includes("ProfilePage") || body.includes("Page Not Found")) {
				return resolve(null);
			}

			// Parse javascript from  bottom of page response
			jsdom = new JSDOM(body, { runScripts: "dangerously" });
			user = jsdom.window._sharedData.entry_data.ProfilePage[0].graphql.user;
		} catch (err) {
			logError(err, `Attempted to scrape data for profile "${username}"`);
			return reject(err);
		}

		// Format posts array
		let posts = user.edge_owner_to_timeline_media.edges
			.map(edge => edge.node)
			.map(post => ({
				id: post.shortcode,
				caption:
					post.edge_media_to_caption.edges.length > 0
						? post.edge_media_to_caption.edges[0].node.text
						: null,
				thumbnails: {
					small: post.thumbnail_resources[1].src,
					large: post.thumbnail_src
				},
				image: post.display_url,
				likes: post.edge_liked_by.count,
				comments: post.edge_media_to_comment.count,
				is_video: post.is_video
			}));

		// Format response object to send out
		return resolve({
			username: user.username,
			profile_pic: {
				small: user.profile_pic_url,
				large: user.profile_pic_url_hd
			},
			verified: user.is_verified,
			private: user.is_private,
			name: user.full_name,
			bio: user.biography === "" ? null : user.biography,
			website: user.external_url,
			postCount: user.edge_owner_to_timeline_media.count,
			followers: user.edge_followed_by.count,
			following: user.edge_follow.count,
			recentPosts: posts
		});
	});
};
