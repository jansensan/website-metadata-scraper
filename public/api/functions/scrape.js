const scrape = require('../../../src/services/scrape');


module.exports = scrapeAPI;


// api
async function scrapeAPI(req, res) {
  const { body } = req;
  const { url } = body;

  try {
    const scraped = await scrape(url);
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');
    res.send(JSON.stringify(scraped));
  } catch (error) {
    res.sendStatus(500);
  }
}