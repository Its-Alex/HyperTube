const passport = require('passport')

const FortyTwoStrategy = require('passport-42').Strategy
const GitHubStrategy = require('passport-github').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

passport.use(new FortyTwoStrategy({
  clientID: global.config.passport.fortyTwo.id,
  clientSecret: global.config.passport.fortyTwo.secret,
  callbackURL: 'http://localhost:3005/auth/42/callback',
  profileFields: {
    'id': (obj) => { return String(obj.id) },
    'username': 'login',
    'name.familyName': 'last_name',
    'name.givenName': 'first_name',
    'emails.0.value': 'email',
    'phoneNumbers.0.value': 'phone',
    'photos.0.value': 'image_url'
  }
}, require('../controllers/user/oauth.js')))

passport.use(new GitHubStrategy({
  clientID: global.config.passport.github.id,
  clientSecret: global.config.passport.github.secret,
  callbackURL: 'http://localhost:3005/auth/github/callback'
}, require('../controllers/user/oauth.js')))

passport.use(new FacebookStrategy({
  clientID: global.config.passport.facebook.id,
  clientSecret: global.config.passport.facebook.secret,
  callbackURL: 'http://localhost:3005/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'emails']
}, require('../controllers/user/oauth.js')))
