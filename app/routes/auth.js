const express = require('express')
const passport = require('passport')
const modelUser = require('../models/user.js')
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

function updateOauth (id, provider, oauthId) {
  return new Promise((resolve, reject) => {
    modelUser.getUserByOauth(oauthId.fortyTwo || oauthId.github || oauthId.facebook).then(result => {
      if (result.length !== 0) return resolve()
      if (provider === '42') {
        modelUser.updateFortyTwoId(id, oauthId.fortyTwo)
        .then(res => {
          resolve()
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
      } else if (provider === 'github') {
        modelUser.updateGithubId(id, oauthId.github)
        .then(res => {
          resolve()
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
      } else if (provider === 'facebook') {
        modelUser.updateFacebookId(id, oauthId.facebook)
        .then(res => {
          resolve()
        })
        .catch(err => {
          console.log(err)
          reject(err)
        })
      } else {
        reject(new Error('No provider found'))
      }
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

function passportCb (req, res) {
  let token = genToken()

  if (!req.user || req.user === null || req.user === undefined || !req.user.mail) {
    return res.redirect('http://localhost:3000/login?success=false&error=Not%20enough%20data')
  }

  if (req.user.reason === 'created') {
    if (typeof req.query.state === 'string' && req.query.state !== '') {
      modelUser.getUserByToken(req.query.state).then(result => {
        if (result.length === 0) return error(res, 'No user found', 403)
        updateOauth(result[0].userId, req.user.provider, {
          fortyTwo: req.user.id_42,
          github: req.user.id_github,
          facebook: req.user.id_facebook
        }).then(result => {
          res.redirect(`http://localhost:3000/popular`)
        }).catch(err => {
          console.log(err)
          return error(res, 'Internal server error', 500)
        })
      })
    } else {
      modelUser.addUser(req.user).then(result => {
        modelToken.addToken(req.user.id, token).then(result => {
          res.redirect(`http://localhost:3000/login?success=true&token=${token}`)
        }).catch(err => {
          console.log(err)
          return error(res, 'Internal server error', 500)
        })
      }).catch(err => {
        console.log(err)
        return error(res, 'Internal server error', 500)
      })
    }
  } else {
    if (typeof req.query.state === 'string' && req.query.state !== '') {
      modelUser.getUserByToken(req.query.state).then(result => {
        if (result.length === 0) return error(res, 'No user found', 403)
        result[0].provider = req.user.provider
        updateOauth(result[0].userId, req.user.provider, {
          fortyTwo: req.user.id_42,
          github: req.user.id_github,
          facebook: req.user.id_facebook
        }).then(result => {
          res.redirect(`http://localhost:3000/popular`)
        }).catch(err => {
          console.log(err)
          return error(res, 'Internal server error', 500)
        })
      })
    } else {
      modelToken.addToken(req.user.id, token).then(result => {
        res.redirect(`http://localhost:3000/login?success=true&token=${token}`)
      })
    }
  }
}

router.get('/42', (req, res, next) => {
  passport.authenticate('42', {
    session: false,
    state: req.query.token ? `${req.query.token}` : ''
  })(req, res, next)
})
router.get('/42/callback',
passport.authenticate('42', {
  scope: 'email',
  session: false
}), passportCb)

router.get('/github', (req, res, next) => {
  passport.authenticate('github', {
    session: false,
    state: req.query.token ? `${req.query.token}` : ''
  })(req, res, next)
})
router.get('/github/callback',
passport.authenticate('github', {
  scope: 'email',
  session: false
}), passportCb)

router.get('/facebook', (req, res, next) => {
  passport.authenticate('facebook', {
    scope: 'email',
    session: false,
    state: req.query.token ? `${req.query.token}` : ''
  })(req, res, next)
})
router.get('/facebook/callback',
passport.authenticate('facebook', {
  scope: 'email',
  session: false
}), passportCb)

module.exports = router
