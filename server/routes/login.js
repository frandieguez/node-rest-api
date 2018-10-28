const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.GSING_CLIENT_ID);

const User = require('../models/user');
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

  User.findOne({
    email: body.email
  }, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!userDB) {
      return res.status(400).json({
        ok: false,
        err: {
          mensaje: '(User) or password incorrect'
        }
      })
    }

    if (!bcrypt.compareSync(body.password, userDB.password)) {
      // if (body.password == userDB.password) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'User or (password) incorrect'
        }
      })
    }

    let token = jwt.sign({
      user: userDB
    }, process.env.JWT_SEED, {
      expiresIn: process.env.JWT_EXPIRE
    })


    res.json({
      ok: true,
      user: userDB,
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

  User.findOne({
    email: googleUser.email
  }, (err, userDB) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err
      })
    }

    if (userDB) {
      if (userDB.google == false) {
        res.status(400).json({
          ok: false,
          err: {
            message: 'You must authenticate with the normal login'
          }
        })
      } else {
        let token = jwt.sign({
          user: userDB
        }, process.env.JWT_SEED, {
          expiresIn: process.env.JWT_EXPIRE
        })

        res.json({
          ok: true,
          usuario: userDB,
          token
        })
      }
    } else {
      // User no existe nen la BD
      let usuario = new User;
      usuario.name = googleUser.name;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ':)';

      usuario.save((err, userDB) => {
        if (err) {
          res.status(400).json({
            ok: true,
            userDB
          })
        }

        let token = jwt.sign({
          user: userDB
        }, process.env.JWT_SEED, {
          expiresIn: process.env.JWT_EXPIRE
        })

        res.json({
          ok: true,
          user: userDB,
          token
        })
      })
    }
  })

})

module.exports = app;
