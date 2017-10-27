// const express = require('express')
// const passport = require('passport')
// const model = require('../models/user.js')
// const router = express.Router()

// const modelToken = require('../models/token.js')

// function error (res, data, err) {
//   res.status(err)
//   res.json({
//     success: false,
//     err: data
//   })
// }

// function genToken () {
//   var str = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`
//   var token = ''

//   for (var count = 0; count < 128; count++) {
//     token += str[Math.floor((Math.random() * str.length))]
//   }
//   return (token)
// }

// function callbackPassport (req, res, next) {
//   passport.authenticate('42', {
//     failureRedirect: 'http://localhost:3000/register',
//     session: false
//   }, (err, user, info) => {
//     if (err) {
//       console.log(err)
//       return error(res, 'Oauth error', 500)
//     }
//     console.log(user)
//     res.json({success: true})
//   })(req, res, next)
// }

// router.get('/42', (req, res, next) => {
//   passport.authenticate('42', {
//     session: false,
//     state: req.query.token
//   })(req, res, next)
// })
// router.get('/42/callback', passport.authenticate('42', {
//   session: false
// }), callbackPassport)

// router.get('/github', (req, res, next) => {
//   passport.authenticate('github', {
//     session: false,
//     state: req.query.token
//   })(req, res, next)
// })
// router.get('/github/callback', passport.authenticate('42', {
//   session: false
// }), callbackPassport)

// router.get('/facebook', (req, res, next) => {
//   passport.authenticate('facebook', {
//     session: false,
//     state: req.query.token
//   })(req, res, next)
// })
// router.get('/facebook/callback', passport.authenticate('42', {
//   session: false
// }), callbackPassport)

// module.exports = router

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
      return error(res, 'Oauth error', 500)
    }
    console.log(user)
    res.json({success: true})
  })(req, res, next)
}

router.get('/42', (req, res, next) => {
  passport.authenticate('42', {
    session: false,
    state: req.query.token
  })(req, res, next)
})
router.get('/42/callback', passport.authenticate('42', {
  session: false
}), callbackPassport)

router.get('/github', (req, res, next) => {
  passport.authenticate('github', {
    session: false,
    state: req.query.token
  })(req, res, next)
})
router.get('/github/callback', passport.authenticate('42', {
  session: false
}), callbackPassport)

router.get('/facebook', (req, res, next) => {
  passport.authenticate('facebook', {
    session: false,
    state: req.query.token
  })(req, res, next)
})
router.get('/facebook/callback', passport.authenticate('42', {
  session: false
}), callbackPassport)

module.exports = router
