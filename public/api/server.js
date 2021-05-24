require('dotenv').config();


const express = require('express');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const port = process.env.API_PORT;


app.use(express.json());
app.use(cors());


// set the defined api routes
routes(app);

// start app
app.listen(port);

console.log(`Metadata scraper started at http://localhost:${ port }`);
