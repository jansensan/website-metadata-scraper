# Website Metadata Scraper

This repo currently hosts both the API and the website (UI) to scrape and parse websites' metadata (generic, OpenGraph, Twitter Card). It is made to work locally, it is not tested to work on a server at this time.


## Instructions

### Getting Started

These should be needed only once.

- Clone this repo
- Run `yarn` to download the dependencies
- Create an `.env` file with the values of the `.env.example` or whichever you prefer.  
⚠️ Fair warning: if you change these values, you may have to ensure the connection between the API and the front-end still works


### Run the API and the website

- In a Terminal window, run `yarn start` to start the API
- In a separate Terminal window, run `yarn start:www` to start the website
- Go to <http://localhost:6464> to view and use the website
