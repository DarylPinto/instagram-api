const fetch = require("node-fetch");

const start = "window._sharedData =";
const end = ";</script>";

module.exports = username => {
	return new Promise(async (resolve, reject) => {
		let res, body, json, user;

		try {
			// Fetch page
			res = await fetch(`http://www.instagram.com/${username}`);
			body = await res.text();

			// Ensure it's actually a user's profile page
			if (
				(!body.includes(start) && !body.includes("ProfilePage")) ||
				body.includes("Page Not Found")
			) {
				return reject({ status: 404 });
			}

			// Parse javascript from  bottom of page response
			json = body.substr(body.indexOf(start) + start.length);
			json = JSON.parse(json.substr(0, json.indexOf(end)));
			user = json.entry_data.ProfilePage[0].graphql.user;
		} catch (err) {
			return reject(err);
		}

		// Format posts array
		let posts = user.edge_owner_to_timeline_media.edges
			.map(edge => edge.node)
			.map(post => ({
				id: post.shortcode,
				likes: post.edge_liked_by.count,
				comments: post.edge_media_to_comment.count,
				thumbnails: {
					small: post.thumbnail_resources[1].src,
					large: post.thumbnail_src
				},
				image: post.display_url
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
			posts: posts
		});
	});
};
