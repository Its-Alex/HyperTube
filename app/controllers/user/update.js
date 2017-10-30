const isEmpty = require('validator/lib/isEmpty')
const isEmail = require('validator/lib/isEmail')
const bcrypt = require('bcryptjs')

const model = require('../../models/user.js')

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (Object.keys(req.body).length === 0) return error(res, 'Nothing to update', 403)
  else if ((typeof req.body.username !== 'string' &&
  typeof req.body.firstName !== 'string' &&
  typeof req.body.lastName !== 'string' &&
  typeof req.body.firstName !== 'string' &&
  typeof req.body.mail !== 'string' &&
  typeof req.body.password !== 'string' &&
  typeof req.body.newPassword !== 'string') ||
  (req.body.username === '' &&
  req.body.firstName === '' &&
  req.body.lastName === '' &&
  req.body.firstName === '' &&
  req.body.mail === '' &&
  req.body.password === '' &&
  req.body.newPassword === '')) {
    return error(res, 'Invalid fields', 403)
  }

  if (typeof req.body.username === 'string' && req.body.username.length <= 30 &&
  !isEmpty(req.body.username)) {
    req.user.username = req.body.username
  }

  if (typeof req.body.firstName === 'string' && req.body.firstName.length <= 36 &&
  !isEmpty(req.body.firstName)) {
    req.user.firstName = req.body.firstName
  }

  if (typeof req.body.lastName === 'string' && req.body.lastName.length <= 36 &&
  !isEmpty(req.body.lastName)) {
    req.user.lastName = req.body.lastName
  }

  if (typeof req.body.mail === 'string' && isEmail(req.body.mail)) {
    req.user.mail = req.body.mail.toLowerCase()
  }

  if (typeof req.body.password === 'string' && typeof req.body.newPassword === 'string' &&
  !isEmpty(req.body.password)) {
    if (req.body.password === req.body.newPassword &&
      req.body.password.length <= 60) {
      req.user.password = bcrypt.hashSync(req.body.password, 10)
    } else {
      return error(res, 'Invalid password', 403)
    }
  }

  model.updateUser(req.user).then(result => {
    delete req.user.password
    res.json({
      success: true,
      user: req.user
    })
  }).catch(err => {
    console.log(err)
    return error(res, 'Internal server error', 500)
  })
}
