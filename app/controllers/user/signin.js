const isEmpty = require('validator/lib/isEmpty')
const isEmail = require('validator/lib/isEmail')
const bcrypt = require('bcryptjs')

const model = require('../../models/user.js')
const modelToken = require('../../models/token.js')

function genToken () {
  var str = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`
  var token = ''

  for (var count = 0; count < 128; count++) {
    token += str[Math.floor((Math.random() * str.length))]
  }
  return (token)
}

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (typeof req.body.mail !== 'string' || typeof req.body.password !== 'string') {
    return error(res, 'Invalid fields', 400)
  }

  if (!isEmail(req.body.mail)) return error(res, 'Invalid mail', 403)
  req.body.mail = req.body.mail.toLowerCase()

  if (isEmpty(req.body.password) || req.body.password.length < 8 ||
  req.body.password.length > 60) {
    return error(res, 'Invalid password', 403)
  }

  model.getUserByMail(req.body.mail).then(results => {
    if (results.length === 0) return error(res, 'User not found', 403)
    if (bcrypt.compareSync(req.body.password, results[0].password)) {
      let token = genToken()
      modelToken.addToken(results[0].id, token).then(results => {
        if (results.affectedRows === 1) {
          res.json({
            success: true,
            token
          })
        } else {
          return error(res, 'Wrong password', 403)
        }
      })
    } else {
      return error(res, 'Wrong password', 403)
    }
  }).catch(err => {
    console.log(err)
    return error(res, 'Internal server error', 500)
  })
}
