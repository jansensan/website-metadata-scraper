const cheerio = require('cheerio');
const got = require('got');
const moment = require('moment');


module.exports = async function scrape(url) {
  const startTime = moment();
  log(`⏳ Scraping "${url}"`);

  return new Promise((resolve, reject) => {
    got(url)
      .then(response => {
        log(`🔬 Parsing...`);

        let scraped = {};

        // parse with cheerio
        const $ = cheerio.load(response.body);

        // get title
        scraped.title = getTitle($);

        const metaNodes = $('meta');

        scraped.description = getDescription(metaNodes);
        scraped.website = getWebsite(metaNodes);

        scraped.openGraph = {
          title: getOGTitle(metaNodes),
          description: getOGDescription(metaNodes),
          image: {
            http: getOGImage(metaNodes),
            https: getOGHTTPSImage(metaNodes),
            alt: getOGImageAlt(metaNodes),
          },
          article: {
            author: getOGArticleAuthor(metaNodes),
            section: getOGArticleSection(metaNodes),
            published: getOGArticlePublishedTime(metaNodes),
            modified: getOGArticleModifiedTime(metaNodes),
          },
          book: {
            author: getOGBookAuthor(metaNodes),
            releaseDate: getOGBookReleaseDate(metaNodes),
          },
          siteName: getOGSiteName(metaNodes),
          url: getOGUrl(metaNodes),
          locale: getOGLocale(metaNodes),
        };

        scraped.twitterCard = {
          username: getTCUsername(metaNodes),
          title: getTCTitle(metaNodes),
          titleText: getTCTitleText(metaNodes),
          description: getTCDescription(metaNodes),
          image: {
            url: getTCImage(metaNodes),
            src: getTCImageSrc(metaNodes),
            alt: getTCImageAlt(metaNodes),
          }
        };

        scraped.duration = moment().valueOf() - startTime.valueOf();

        log(`✅ Parsing completed in ${scraped.duration}ms`);

        resolve(scraped);
      })
      .catch(error => {
        log(`❌ An error occured`);
        reject(error);
      });
  });
}


// methods
function getTitle(parser) {
  const titleNode = parser('title')[0];

  if (!titleNode) {
    return '';
  }

  if (titleNode.children && titleNode.children[0].data) {
    return titleNode.children[0].data;
  }

  return '';
}

function getDescription(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'name',
      value: 'description'
    }
  );
}

function getWebsite(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'website'
    }
  );
}

function getMetaContent(nodes, options) {
  let response = '';
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const attributes = node.attribs;
    const value = attributes[options.attribute];
    if (value === options.value) {
      response = attributes.content;
      break;
    }
  }
  return response;
}


// parsing methods - opengraph
function getOGTitle(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'og:title'
    }
  )
}

function getOGDescription(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'og:description'
    }
  )
}

function getOGImage(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'og:image'
    }
  );
}

function getOGHTTPSImage(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'og:image:secure_url'
    }
  );
}

function getOGImageAlt(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'og:image:alt'
    }
  );
}

function getOGArticleAuthor(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'article:author'
    }
  );
}

function getOGArticleSection(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'article:section'
    }
  );
}

function getOGArticlePublishedTime(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'article:published_time'
    }
  );
}

function getOGArticleModifiedTime(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'article:modified_time'
    }
  );
}

function getOGBookAuthor(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'book:author'
    }
  );
}

function getOGBookReleaseDate(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'book:release_date'
    }
  );
}

function getOGSiteName(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'og:site_name'
    }
  )
}

function getOGUrl(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'og:url'
    }
  )
}

function getOGLocale(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'property',
      value: 'og:locale'
    }
  )
}


// parsing methods - twitter card
function getTCUsername(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'name',
      value: 'twitter:site'
    }
  )
}

function getTCTitle(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'name',
      value: 'twitter:title'
    }
  )
}

function getTCTitleText(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'name',
      value: 'twitter:text:title'
    }
  )
}

function getTCDescription(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'name',
      value: 'twitter:description'
    }
  )
}

function getTCImage(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'name',
      value: 'twitter:image'
    }
  );
}

function getTCImageSrc(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'name',
      value: 'twitter:image:src'
    }
  );
}

function getTCImageAlt(nodes) {
  return getMetaContent(
    nodes,
    {
      attribute: 'name',
      value: 'twitter:image:alt'
    }
  );
}


// utils
function log(message) {
  console.log(`${getTimeStamp()} ${message}`);
}

function getTimeStamp(time) {
  if (!time) {
    time = moment();
  }

  return time.format('HH:mm:ss');
}
