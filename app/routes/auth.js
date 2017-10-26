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

function callbackPassport (req, res, next) {
  passport.authenticate('42', {
    failureRedirect: 'http://localhost:3000/register',
    session: false
  }, (err, user, info) => {
    if (err) {
      console.log(err)
      if (err.message) return error(res, err.message, 418)
      return error(res, 'Internal server error', 500)
    }
    if (!user) return error(res, 'No user data', 403)

    let token = genToken()
    if (req.query.state && user.provider && user.providerId) {
      model.getUserByToken(req.query.state).then(result => {
        if (result.length === 0) return error(res, 'Bad token', 403)
        switch (user.provider) {
          case '42':
            model.updateFortyTwoId(user.id, user.providerId).then(response => {
              console.log(response)
              res.json({
                success: true
              })
            }).catch(err => {
              console.log(err)
              return error(res, 'Internal server error', 500)
            })
            break
          case 'github':
            model.updateGithubId(user.id, user.providerId).then(response => {
              console.log(response)
              res.json({
                success: true
              })
            }).catch(err => {
              console.log(err)
              return error(res, 'Internal server error', 500)
            })
            break
          case 'facebook':
            model.updateFacebookId(user.id, user.providerId).then(response => {
              console.log(response)
              res.json({
                success: true
              })
            }).catch(err => {
              console.log(err)
              return error(res, 'Internal server error', 500)
            })
            break
          default:
            break
        }
      })
    } else {
      modelToken.addToken(user.id, token).then(result => {
        res.json({
          success: true,
          token
        })
      }).catch(err => {
        console.log(err)
        error(res, 'Internal server error', 500)
      })
    }
  })(req, res, next)
}

router.get('/42', (req, res, next) => {
  passport.authenticate('42', {
    session: false,
    state: req.query.token
  })(req, res, next)
})
router.get('/42/callback', callbackPassport)

router.get('/github', (req, res, next) => {
  passport.authenticate('github', {
    session: false,
    state: req.query.token
  })(req, res, next)
})
router.get('/github/callback', callbackPassport)

router.get('/facebook', (req, res, next) => {
  passport.authenticate('facebook', {
    session: false,
    state: req.query.token
  })(req, res, next)
})
router.get('/facebook/callback', callbackPassport)

module.exports = router
