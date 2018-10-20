const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.GSING_CLIENT_ID);

const Usuario = require('../models/usuario');
const app = express();

// Configureaciones de google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GSING_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
  });
  const payload = ticket.getPayload();

  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}

app.post('/login', (req, res) => {

  let body = req.body;

  Usuario.findOne({
    email: body.email
  }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          mensaje: '(Usuario) o contraseña incorrectos'
        }
      })
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o (contraseña) incorrectos'
        }
      })
    }

    let token = jwt.sign({
      usuario: usuarioDB
    }, process.env.JWT_SEED, {
      expiresIn: process.env.JWT_EXPIRE
    })


    res.json({
      ok: true,
      usuario: usuarioDB,
      token
    })
  });
});

app.post('/google', async (req, res) => {
  var token = req.body.idtoken;

  let googleUser = await verify(token).catch((err) => {
    res.status(403).json({
      ok: false,
      err
    })
  })

  Usuario.findOne({
    email: googleUser.email
  }, (err, usuarioDB) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err
      })
    }

    if (usuarioDB) {
      if (usuarioDB.google == false) {
        res.status(400).json({
          ok: false,
          err: {
            message: 'Debe autenticarse con un usuario normal'
          }
        })
      } else {
        let token = jwt.sign({
          usuario: usuarioDB
        }, process.env.JWT_SEED, {
          expiresIn: process.env.JWT_EXPIRE
        })

        res.json({
          ok: true,
          usuario: usuarioDB,
          token
        })
      }
    } else {
      // Usuario no existe nen la BD
      let usuario = new Usuario;
      usuario.nombre = googleUser.name;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ':)';

      usuario.save((err, usuarioDB) => {
        if (err) {
          res.status(400).json({
            ok: true,
            usuarioDB
          })
        }

        let token = jwt.sign({
          usuario: usuarioDB
        }, process.env.JWT_SEED, {
          expiresIn: process.env.JWT_EXPIRE
        })

        res.json({
          ok: true,
          usuario: usuarioDB,
          token
        })
      })
    }
  })

})

module.exports = app;
