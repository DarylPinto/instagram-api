![Preview](https://i.imgur.com/IZYwWyW.png)
> "Because getting content from Instagram shouldn't be that frustrating"

## How to use

1. Install [NodeJS](https://nodejs.org/) (12.12.0 or higher)
2. `git clone` this repo
3. `cd` into the repo directory
4. `npm install` (This may take a few minutes - be patient)
5. `npm start`
6. Visit http://localhost:3000 in your browser

Optionally, settings can be tweaked in `api/config.json`

## Features
* Rate limiting
* Response caching

## Limitations

* Only supports `GET` requests on user pages (by design)
* Only includes 12 most recent posts
