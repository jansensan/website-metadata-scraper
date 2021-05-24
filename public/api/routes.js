const scrape = require('./functions/scrape');


module.exports = (app) => {
  // set headers for cors
  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  });

  // home
  app.get('/', (req, res) => {
    res.send('<h1>Metadata Scraper</h1>');
  });

  // scrap
  app.post('/scrape', scrape);
};
