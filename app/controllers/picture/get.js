const fs = require('fs')
const modelUser = require('../../models/user.js')

const picsDir = require('path').dirname(require.main.filename) + '/pictures/'

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  let format = '.png'

  if (!req.params.id || (req.params.id.length !== 36 && req.params.id.length !== 128)) return error(res, 'Wrong id', 403)
  if (!fs.existsSync(picsDir)) return error(res, 'No picture found', 404)

  if (req.params.id.length === 128) {
    return modelUser.getUserByToken(req.params.id).then(result => {
      if (result.length === 0) return error(res, 'Wrong id', 403)
      if (!fs.existsSync(picsDir + result[0].userId + format)) {
        format = '.jpg'
        if (!fs.existsSync(picsDir + result[0].userId + format)) {
          return error(res, 'No picture found', 404)
        }
      }
      if (format === '.png') res.set('Content-Type', 'image/png')
      if (format === '.jpg') res.set('Content-Type', 'image/jpg')

      return res.sendFile(picsDir + result[0].userId + format)
    }).catch(err => console.log(err))
  } else if (req.params.id.length === 36) {
    if (!fs.existsSync(picsDir + req.params.id + format)) {
      format = '.jpg'
      if (!fs.existsSync(picsDir + req.params.id + format)) {
        return error(res, 'No picture found', 404)
      }
    }

    if (format === '.png') res.set('Content-Type', 'image/png')
    if (format === '.jpg') res.set('Content-Type', 'image/jpg')

    return res.sendFile(picsDir + req.params.id + format)
  }
  return error(res, 'Wrong id', 403)
}
