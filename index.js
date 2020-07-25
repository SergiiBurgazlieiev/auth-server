//Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

/*
    DB SETUP
 */
const url = 'mongodb://127.0.0.1:27017/auth';
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

//check whether the connection succeeds
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
});
db.on('error', err => {
  console.error('connection error:', err)
});

/*
    APP SETUP

    Morgan and bodyParser are middleware in express
    Any incoming request will be past into them. 
    Morgan is a login framework(mostly for debugging)
    bodyParser is used to parse incoming requests into json
*/

app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*' }))
router(app);

/*
    SERVER SETUP
*/

const port = process.env.PORT || 8080;
const server = http.createServer(app);
server.listen(port);
console.log('server listening on:', port);