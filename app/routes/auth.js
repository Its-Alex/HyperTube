const express = require('express')
const passport = require('passport')
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

router.get('/42', passport.authenticate('42', {session: false}))
router.get('/42/callback',
passport.authenticate('42', {
  failureRedirect: 'http://localhost:3000/auth/signup',
  session: false
}), signin)

router.get('/github', passport.authenticate('github', {session: false}))
router.get('/github/callback',
passport.authenticate('github', {
  failureRedirect: 'http://localhost:3000/auth/signup',
  session: false
}), signin)

module.exports = router
