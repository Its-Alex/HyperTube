const express = require('express')
const passport = require('passport')
const model = require('../models/user.js')
const router = express.Router()

const modelToken = require('../models/token.js')

function error (res, data, err) {
  res.status(err)
  res.json({
    success: false,
    err: data
  })
}

function genToken () {
  var str = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`
  var token = ''

  for (var count = 0; count < 128; count++) {
    token += str[Math.floor((Math.random() * str.length))]
  }
  return (token)
}

function signin (req, res) {
  let token = genToken()
  console.log(req.UserId)

  if (!req.user) return error(res, 'User not found', 404)
  modelToken.addToken(req.user.id, token).then(result => {
    res.json({
      success: true,
      token
    })
  }).catch(err => {
    console.log(err)
    error(res, 'Internal server error', 500)
  })
}

let middleware = () => {
  return (req, res, next) => {
    var auth = req.get('Authorization')

    if (auth !== undefined) {
      auth = auth.split(' ')
      if (auth[0] === 'Bearer' || auth[1].length === 128 || auth.length === 2) {
        model.getUserByToken(auth[1]).then(results => {
          if (results.length <= 0) return next()
          req.userDb = {
            token: auth[1],
            id: results[0].userId,
            mail: results[0].mail,
            username: results[0].username,
            firstName: results[0].firstName,
            lastName: results[0].lastName,
            password: results[0].password
          }
          return next()
        }).catch(err => {
          console.log(err)
          return error(res, 'Internal server error', 500)
        })
      } else {
        return next()
      }
    } else {
      return next()
    }
  }
}

router.get('/42', middleware(), passport.authenticate('42', {session: false}))
router.get('/42/callback',
passport.authenticate('42', {
  failureRedirect: 'http://localhost:3000/register',
  session: false
}), signin)

router.get('/github', middleware(), passport.authenticate('github', {session: false}))
router.get('/github/callback',
passport.authenticate('github', {
  failureRedirect: 'http://localhost:3000/register',
  session: false
}), signin)

router.get('/facebook', middleware(), passport.authenticate('facebook', {scope: 'email', session: false}))
router.get('/facebook/callback',
passport.authenticate('facebook', {
  failureRedirect: 'http://localhost:3000/register',
  session: false,
  scope: 'email'
}), signin)

module.exports = router
