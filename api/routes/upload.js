const express = require('express')
const User = require('../models/user');
const app = express();

app.put('/upload/:type/:id', (req, res) => {
  let type = req.params.type;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No file uploaded'
      }
    })
  }

  // validate type
  let validTypes = ['products', 'users'];
  if (validTypes.indexOf(type) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Valid types: ' + validTypes.join(', '),
        type
      }
    })
  }

  // validate id
  // let user = User.findById(id, (err, user) => {

  // })

  let file = req.files.file;

  if (!/image\/.*/.test(file.mimetype)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Not valid extension. Allowed: image/*',
        ext: file.mimetype
      }
    })
  }

  let parts = file.name.split('.');
  let extension = parts[parts.length - 1];
  let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

  file.mv(`uploads/${type}/${fileName}`, (err) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err
      })
    }

    // Image loaded

    res.json({
      ok: true,
      message: 'File uploaded suddessfully.'
    })
  })
})

module.exports = app;
