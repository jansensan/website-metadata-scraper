const _= require('lodash');

const scrape = require('../src/services/scrape');


exports.handler = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const url = _.get(body, 'url');

  if (event.httpMethod !== 'POST') {
    return callback(
      null,
      buildResponse('preflight step'),
    );
  }

  try {
    const scraped = await scrape(url);
    return callback(
      null,
      buildResponse(scraped),
    );
  } catch (error) {
    throwError(
      callback,
      500,
      `Error parsing URL "${ url }".`,
    );
  }
}


// response methods
function buildResponse(data) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Request-Method': 'GET, POST, PUT, DELETE',
    },
    body: JSON.stringify(data)
  };
};

function throwError(callback, statusCode, body) {
  return callback(
    null,
    {
      statusCode,
      body,
    }
  );
}