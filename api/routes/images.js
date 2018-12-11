const express = require('express')
const path = require('path');
const fs = require('fs');

const app = express();
let {
  checkTokenImg
} = require('../middlewares/authentication.js');

app.get('/image/:type/:img', [ checkTokenImg ], (req, res) => {
  let type = req.params.type;
  let image = req.params.img;

  let pathImg = path.resolve(__dirname, `../../uploads/${ type }/${ image }`);
  if (!fs.existsSync(pathImg)) {
    pathImg = path.resolve(__dirname, '../assets/no-image.jpg');
  }

  res.sendFile(pathImg)
});

module.exports = app;
