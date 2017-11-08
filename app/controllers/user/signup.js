const isEmpty = require('validator/lib/isEmpty')
const isEmail = require('validator/lib/isEmail')
const checkBase = require('check-base-encoding');
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const fs = require('fs')

const model = require('../../models/user.js')

const picturesDir = require('path').dirname(require.main.filename) + '/pictures'

let saveProfilePicture = (photo, id) => {
  if (!fs.existsSync(picturesDir)) {
    fs.mkdirSync(picturesDir)
  }
  fs.writeFile(picturesDir + '/' + id + '.png',
  photo.replace(/^data:image\/png;base64,/, ''),
  'base64', (err) => (err) ? console.log(err) : null)
}

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (typeof req.body.username !== 'string' ||
  typeof req.body.mail !== 'string' || typeof req.body.firstName !== 'string' ||
  typeof req.body.lastName !== 'string' ||
  typeof req.body.password !== 'string' ||
  typeof req.body.newPassword !== 'string' ||
  typeof req.body.photo !== 'string') return error(res, 'Invalid fields', 400)

  if (isEmpty(req.body.username) || req.body.username.length > 30) {
    return error(res, 'Invalid username', 403)
  }

  if (!isEmail(req.body.mail)) return error(res, 'Invalid mail', 403)
  req.body.mail = req.body.mail.toLowerCase()

  if (isEmpty(req.body.firstName) || req.body.firstName.length > 36) {
    return error(res, 'Invalid first name', 403)
  }

  if (isEmpty(req.body.lastName) || req.body.lastName.lastName > 36) {
    return error(res, 'Invalid last name', 403)
  }

  if (req.body.password !== req.body.newPassword) {
    return error(res, 'Password does not match', 403)
  }

  if (isEmpty(req.body.password) || req.body.password.length < 8 ||
  req.body.password.length > 60) {
    return error(res, 'Invalid password', 403)
  } else {
    req.body.password = bcrypt.hashSync(req.body.password, 10)
  }

  req.body.photo = req.body.photo.replace('data:image/png;base64,', '')
  if (!checkBase.isBase64(req.body.photo)) return error(res, 'Invalid photo', 403)

  req.body.id = uuid()

  model.getUserByMail(req.body.mail).then(results => {
    if (results.length !== 0) return error(res, 'Mail already exist', 403)
    model.addUser(req.body).then(results => {
      if (results.affectedRows === 1) {
        res.status(201)
        res.json({success: true})
        saveProfilePicture(req.body.photo, req.body.id)
      } else {
        console.log(results)
        return error(res, 'Internal server error', 500)
      }
    }).catch(err => {
      console.log(err)
      return error(res, 'Internal server error', 500)
    })
  }).catch(err => {
    console.log(err)
    return error(res, 'Internal server error', 500)
  })
}
