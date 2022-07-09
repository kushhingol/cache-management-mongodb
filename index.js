require("dotenv").config();
require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('./_helpers/errorHandler');;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// api routes
app.use('/api/cache', require('./cache-management/cache-management.controller'));

// global error handler
app.use(errorHandler);


// Configuration for starting the server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

