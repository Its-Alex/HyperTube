const axios = require('axios')
const uuidv4 = require('uuid/v4')
const fs = require('fs')

const model = require('../../models/user.js')
const picturesDir = require('path').dirname(require.main.filename) + '/pictures'

let saveProfilePicture = (url, id, provider) => {
  if (!fs.existsSync(picturesDir)) fs.mkdirSync(picturesDir)
  if (provider !== 'facebook') {
    axios.get(url, {
      responseType: 'arraybuffer'
    }).then(response => fs.writeFile(picturesDir + '/' + id + '.png',
    Buffer.from(response.data, 'binary').toString('base64').replace(/^data:image\/png;base64,/, ''),
    'base64',
    (err, data) => {
      if (err) console.log(err)
    })).catch(err => console.log(err))
  } else {
    axios.get(url, {
      responseType: 'arraybuffer'
    }).then(response => fs.writeFile(picturesDir + '/' + id + '.jpg',
    Buffer.from(response.data, 'binary').toString('base64').replace(/^data:image\/png;base64,/, ''),
    'base64',
    (err, data) => {
      if (err) console.log(err)
    })).catch(err => console.log(err))
  }
}

let getUserFromProfile = (profile) => {
  let user = {}
  user.id = uuidv4()
  user.mail = profile.emails[0].value.toLowerCase()
  if (profile.provider === '42') {
    user.id_42 = profile.id
    user.id_github = null
    user.username = profile.name.givenName + ' ' + profile.name.familyName || 'none'
    user.firstName = profile.name.givenName || 'none'
    user.lastName = profile.name.familyName || 'none'
  } else if (profile.provider === 'github' || profile.provider === 'facebook') {
    if (profile.provider === 'github') user.id_github = profile.id
    if (profile.provider === 'facebook') user.id_facebook = profile.id
    user.username = profile.displayName || 'none'
    let name = profile.displayName ? profile.displayName.split(' ') : 'none'
    user.firstName = name.length === 2 ? name[0] : 'none'
    user.lastName = name.length === 2 ? name[1] : 'none'
  }
  saveProfilePicture(profile.photos[0].value, user.id, profile.provider)
  return (user)
}

module.exports = (accessToken, refreshToken, profile, cb) => {
  if (!profile || !profile.emails) return cb(null, null)
  model.getUserByOauth(profile.id).then(res => {
    if (res.length === 0) {
      if (profile.emails.length === 0) return cb(null, null)
      model.getUserByMail(profile.emails[0].value).then(res => {
        if (res.length === 0) {
          let user = getUserFromProfile(profile)
          user.provider = profile.provider
          user.reason = 'created'
          cb(null, user)
        } else {
          res[0].provider = profile.provider
          res[0].reason = 'mail'
          cb(null, res[0])
        }
      })
    } else {
      res[0].provider = profile.provider
      res[0].reason = 'oauth'
      cb(null, res[0])
    }
  }).catch(err => cb(err))
}
