const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const {
  checkToken,
  checkAdminRole
} = require('../middlewares/authentication');

const app = express();

app.get('/usuario', checkToken, function (req, res) {
  let offset = Number(req.query.offset) || 0;
  let limit = Number(req.query.limit) || 0;

  let conditions = {
    estado: true
  };

  Usuario.find(conditions, 'nombre email role estado google img')
    .skip(offset)
    .limit(limit)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      Usuario.count(conditions, (err, total) => {
        res.json({
          ok: true,
          total,
          usuarios
        })
      });

    });
});

app.post('/usuario', [checkToken, checkAdminRole], function (req, res) {

  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });


  usuario.save((err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });


  });


});

app.put('/usuario/:id', checkToken, function (req, res) {

  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

  Usuario.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  }, (err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });

  })

});

app.delete('/usuario/:id', checkToken, function (req, res) {
  let id = req.params.id;

  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  //   if (err) {
  //     res.status(400).json({
  //       ok: false,
  //       err
  //     })
  //   }

  //   if (!usuarioBorrado) {
  //     res.status(400).json({
  //       ok: false,
  //       err: {
  //         mensaje: 'Usuario no encontrado'
  //       }
  //     })
  //   }


  //   res.json({
  //     ok: true,
  //     mensaje: 'Usuario borrado'
  //   })
  // })

  Usuario.findByIdAndUpdate(id, {
    estado: false
  }, {
    new: true,
    runValidators: true
  }, (err, usuarioDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });

  })

});

module.exports = app;
