const isEmpty = require('validator/lib/isEmpty')
const bcrypt = require('bcryptjs')

const model = require('../../models/user.js')
const modelForget = require('../../models/forget.js')

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  console.log(req.body)
  if (typeof req.body.token !== 'string' || req.body.token === '' ||
    typeof req.body.password !== 'string' || req.body.password === '') {
    return error(res, 'Invalid fields', 400)
  }

  if (isEmpty(req.body.password) || req.body.password.length < 8 ||
    req.body.password.length > 60) {
    return error(res, 'Invalid password', 403)
  } else {
    req.body.password = bcrypt.hashSync(req.body.password, 10)
  }

  modelForget.getByToken(req.body.token).then(results => {
    if (results.length === 0) return error(res, 'Bad token', 403)

    model.updatePassword(results[0].userId, req.body.password).then(() => {
      res.json({success: true})
      modelForget.delete(results[0].userId).then(() => {})
      .catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
      return error(res, 'Internal server error', 500)
    })
  }).catch(err => {
    console.log(err)
    return error(res, 'Internal server error', 500)
  })
}
