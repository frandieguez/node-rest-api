const express = require('express');
let {
  checkToken
} = require('../middlewares/authentication.js');
const _ = require('underscore');

let app = express();

let Category = require('../models/category.js');

app.get('/category', checkToken, (req, res) => {
  let conditions = {
    status: true
  }

  Category.find(conditions)
    .sort('name')
    .populate('user', '_id name email')
    .exec((err, categories) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      Category.count(conditions, (err, total) => {
        res.json({
          ok: true,
          total,
          categories
        })
      });

    });
});

app.post('/category', checkToken, (req, res) => {
  let body = req.body;
  let userId = req.user._id;

  let category = new Category({
    name: body.name,
    createdBy: userId,
    status: body.status,
  });

  category.save((err, categoryDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoryDB) {
      res.status(400).json({
        ok: false,
        err: {
          message: 'Unable to create the category'
        }
      })
    }

    res.json({
      ok: true,
      category: categoryDB
    });
  });
})

app.get('/category/:id', checkToken, (req, res) => {

  let id = req.params.id;

  Category.findById(id, (err, categoryDB) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      category
    })
  })

});

app.put('/category/:id', checkToken, (req, res) => {

  let id = req.params.id;
  let body = _.pick(req.body, ['name']);

  Category.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  }, (err, categoryDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!categoryDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'The id doesnt exists'
        }
      })
    }

    res.json({
      ok: true,
      category: categoryDB
    });

  })

})

app.delete('/category/:id', [checkToken, checkAdminRole], (req, res) => {
  let id = req.params.id;

  Category.findByIdAndUpdate(id, {
    status: false
  }, {
    new: true,
    runValidators: true
  }, (err, categoryDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      category: categoryDB
    });

  })

})

module.exports = app;
