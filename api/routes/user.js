const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');
const {
  checkToken,
  checkAdminRole
} = require('../middlewares/authentication');

const app = express();

app.get('/user', checkToken, function (req, res) {
  let offset = Number(req.query.offset) || 0;
  let limit = Number(req.query.limit) || 0;

  let conditions = {
    status: true
  };
  console.log(offset, limit)

  User.find(conditions, 'name email role status google img')
    .skip(offset)
    .limit(limit)
    .exec((err, users) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      User.count(conditions, (err, total) => {
        res.json({
          ok: true,
          total,
          users
        })
      });

    });
});

app.post('/user', [checkToken, checkAdminRole], function (req, res) {

  let body = req.body;

  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  user.save((err, userDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      user: userDB
    });

  });

});

app.put('/user/:id', checkToken, function (req, res) {

  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

  User.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  }, (err, userDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      user: userDB
    });

  })

});

app.delete('/user/:id', checkToken, function (req, res) {
  let id = req.params.id;

  // User.findByIdAndRemove(id, (err, userBorrado) => {
  //   if (err) {
  //     res.status(400).json({
  //       ok: false,
  //       err
  //     })
  //   }

  //   if (!userBorrado) {
  //     res.status(400).json({
  //       ok: false,
  //       err: {
  //         mensaje: 'User no encontrado'
  //       }
  //     })
  //   }


  //   res.json({
  //     ok: true,
  //     mensaje: 'User borrado'
  //   })
  // })

  User.findByIdAndUpdate(id, {
    estado: false
  }, {
    new: true,
    runValidators: true
  }, (err, userDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      user: userDB
    });

  })

});

module.exports = app;
