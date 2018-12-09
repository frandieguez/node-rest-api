const express = require('express');
const app = express();

app.use(require('./category'));
app.use(require('./user'));
app.use(require('./product'));
app.use(require('./login'));
app.use(require('./upload'));

module.exports = app;