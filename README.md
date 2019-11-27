![Preview](https://i.imgur.com/NPc8Fdn.png)
> https://insta-api.now.sh/  
> "Because getting content from Instagram shouldn't be that frustrating"

## Example
`GET https://insta-api.now.sh/api/cristiano`

```json
{
	"username": "cristiano",
	"link": "https://www.instagram.com/cristiano/",
	"profile_pic": {
		"small": "https://...",
		"large": "https://..."
	},
	"verified": true,
	"private": false,
	"name": "Cristiano Ronaldo",
	"bio": null,
	"website": "http://www.cristianoronaldo.com/",
	"postCount": 2704,
	"followers": 191091698,
	"following": 445,
	"recentPosts": [
		{
			"id": "B5Xkbb_A3Z9",
			"link": "https://www.instagram.com/p/B5Xkbb_A3Z9/",
			"image": "https://...",
			"thumbnail": {
				"small": "https://...",
				"large": "https://..."
			},
			"caption": "Great win at home! Top of the group!💪🏽\n#finoallafine #forzajuve",
			"likes": 2348107,
			"comments": 8439,
			"is_video": false,
			"location": null,
			"date": "2019-11-27T12:06:34.000Z"
		},
		...
	]
}
```

## Self Hosting

You can also opt to host your own instance of the API by following the steps below:

1. Install [NodeJS](https://nodejs.org/) (12.12.0 or higher)
2. [Download](https://github.com/DarylPinto/instagram-api/archive/self-hosted.zip) the repo on the `self-hosted` branch
3. `cd` into the repo directory
4. `npm install` (This may take a few minutes - be patient)
5. `npm start`
6. Visit http://localhost:3000 in your browser

Optionally, settings can be tweaked in `api/config.json`

## Limitations

* Only supports `GET` requests on Instagram user pages (by design)
* Data only updates every 5 minutes (by design - for caching purposes)
* Only includes 12 most recent posts
