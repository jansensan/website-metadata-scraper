require('dotenv').config();


const express = require('express');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const address = process.env.API_ADDRESS;
const port = process.env.API_PORT;


app.use(express.json());
app.use(cors());


// set the defined api routes
routes(app);

// start app
app.listen(port, address);

console.log(`Metadata scraper started at http://${ address }:${ port }`);
