const jwt = require('jsonwebtoken');

let checkToken = (req, res, next) => {
  let token = req.get('Authorization');

  jwt.verify(token, process.env.JWT_SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Authentication required or invalid, jwt token not valid.'
        }
      })
    }

    req.user = decoded.user

    next()
  })
}

checkAdminRole = (req, res, next) => {
  let user = req.user;

  if (user.role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      ok: false,
      err: {
        message: 'User without privileges'
      }
    })
  }

  next()
}

module.exports = {
  checkToken,
  checkAdminRole
}
