const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const path = require('path');

require('dotenv').config();

const isProduction = process.env.NODE_ENV == 'production';

// Start the express application
const app = express();

// Configure our app
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../public')));
console.log(__dirname + '/../public');

if (!isProduction) {
  app.use(errorHandler())
}

app.use(require('./routes/index'));

mongoose.connect(process.env.MONGO_URI, (err, res) => {
  if (err) throw err;

  console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
  console.log('Escuchando puerto: ', process.env.PORT);
});
