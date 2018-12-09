const express = require('express');
let {
  checkToken
} = require('../middlewares/authentication.js');
const _ = require('underscore');

let app = express();

let Product = require('../models/product.js');

app.get('/product', checkToken, (req, res) => {
  let from = req.query.from || 0;

  Product.find()
    .populate('category', 'name')
    .populate('user', 'name')
    .skip(from)
    .limit(5)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      Product.count({}, (err, total) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err
          })
        }

        res.json({
          ok: true,
          total,
          products
        })
      });

    });
});

app.get('/products/search/:term', checkToken, (req, res) => {
  let term = req.params.term;
  let regex = new RegExp(term, 'i')

  Product.find({
      name: regex
    })
    .populate('category', 'name')
    .exec((err, product) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      return res.json({
        product
      })

    })
})

app.post('/product', checkToken, (req, res) => {
  let body = req.body;
  let userId = req.user._id;
  let properties = Object.assign({
      user: userId
    },
    _.pick(body, ['name', 'category', 'unitPrice', 'available'])
  );

  let product = new Product(properties);

  product.save((err, productDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productDB) {
      res.status(400).json({
        ok: false,
        err: {
          message: 'Unable to create the product'
        }
      })
    }

    res.json({
      ok: true,
      product: productDB
    });
  });
})

app.get('/product/:id', checkToken, (req, res) => {
  // Que aparezcan todas las categorias
  let id = req.params.id;

  Product.findById(id)
    .populate('user', 'name email')
    .populate('category', 'name')
    .exec((err, productDB) => {
      if (err) {
        res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        productDB
      })
    })
});

app.put('/product/:id', checkToken, (req, res) => {

  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'category', 'unitPrice']);

  Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  }, (err, productDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!productDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'The id doesnt exists'
        }
      })
    }

    res.json({
      ok: true,
      product: productDB
    });

  })

})

app.delete('/product/:id', [checkToken, checkAdminRole], (req, res) => {
  let id = req.params.id;

  Product.findByIdAndUpdate(id, {
    available: false
  }, {
    new: true,
    runValidators: true
  }, (err, productDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!productDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'ID doesnt exists'
        }
      });
    }

    res.json({
      ok: true,
      product: productDB
    });

  })

})

module.exports = app;
