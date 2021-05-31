# Metadata Scraper Functions

This repository is supposed to host lambda functions which would be served by Netlify.

However, due to CORS idiocy, too much time gets wasted on making this work properly.

Instead, this repo currently hosts both the API and its website. It is made to work locally, it is not tested to work on a server at this time.


## Instructions

### Getting Started

These should be needed only once.

- Clone this repo
- Run `yarn` to download the dependencies


### Run the API and the website

- In a Terminal window, run `yarn start` to start the API
- In a separate Terminal window, run `yarn start:www` to start the website
- Go to <http://127.0.0.1:6464> to view and use the website
