const express = require('express')
const User = require('../models/user');
const Product = require('../models/product');

const app = express();

const fs = require('fs');
const path = require('path');

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

  file.mv(__dirname + `/../../uploads/${type}/${fileName}`, (err) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err
      })
    }

    if (type == 'users') {
      return userImage(id, res, fileName);
    } else {
      return productImage(id, res, fileName);
    }
  })
});


let userImage = async (id, res, fileName) => {
  User.findById(id, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!userDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'User doesnt exists'
        }
      });
    }

    removeImage('users', userDB.img);

    userDB.img = fileName;

    userDB.save((err, userDB) => {
      res.json({
        ok: true,
        user: userDB,
        img: fileName,
      });
    })
  })
}

let productImage = async (id, res, fileName) => {
  Product.findById(id, (err, productDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'User doesn\'t exists'
        }
      });
    }

    removeImage('products', productDB.img);

    productDB.img = fileName;

    productDB.save((err, productDB) => {
      res.json({
        ok: true,
        product: productDB,
        img: fileName,
      });
    })
  })
}

let removeImage = async (type, fileName) => {
  let imagePath = path.resolve(__dirname, `../../uploads/${ type }/${ fileName }`);

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  return true;
}

module.exports = app;
