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
    user.username = profile.name.givenName + ' ' + profile.name.familyName
    user.firstName = profile.name.givenName
    user.lastName = profile.name.familyName
  } else if (profile.provider === 'github' || profile.provider === 'facebook') {
    if (profile.provider === 'github') user.id_github = profile.id
    if (profile.provider === 'facebook') user.id_facebook = profile.id
    user.username = profile.displayName
    let name = profile.displayName.split(' ')
    user.firstName = name[0]
    user.lastName = name[1]
  }
  saveProfilePicture(profile.photos[0].value, user.id, profile.provider)
  return (user)
}

module.exports = (accessToken, refreshToken, profile, cb) => {
  model.getUserByOauth(profile.id).then(res => {
    if (res.length === 0) {
      model.getUserByMail(profile.emails[0].value).then(res => {
        if (res.length === 0) {
          let user = getUserFromProfile(profile)
          model.addUser(user).then(res => {
            user.reason = 'created'
            cb(null, user)
          }).catch(err => cb(err))
        } else {
          res[0].provider = profile.provider
          res[0].providerId = profile.id
          res[0].reason = 'mail'
          cb(null, res[0])
        }
      })
    } else {
      res[0].provider = profile.provider
      res[0].providerId = profile.id
      res[0].reason = 'oauth'
      cb(null, res[0])
    }
  }).catch(err => cb(err))
}
