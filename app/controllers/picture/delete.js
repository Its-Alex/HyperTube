const fs = require('fs')

const picsDir = require('path').dirname(require.main.filename) + '/pictures/'

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (!fs.existsSync(picsDir)) fs.mkdirSync(picsDir)

  let format = '.png'

  if (!fs.existsSync(picsDir + req.user.id + '.png')) {
    format = '.jpg'
    if (!fs.existsSync(picsDir + req.user.id + '.jpg')) {
      return error(res, 'No picture found', 404)
    }
  }

  if (format === '.jpg') {
    fs.unlink(picsDir + req.user.id + '.jpg', (err) => {
      if (err) return error(res, 'Internal server error', 500)
      res.json({success: true})
    })
  }
  if (format === '.png') {
    fs.unlink(picsDir + req.user.id + '.png', (err) => {
      if (err) return error(res, 'Internal server error', 500)
      res.json({success: true})
    })
  }
}
