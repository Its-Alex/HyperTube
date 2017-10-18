const fs = require('fs')
const base64Regex = require('base64-regex')

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

  if (!req.body.pic.match(base64Regex())) return error(res, 'Invalid photo', 403)

  res.status(202)
  res.json({
    success: true
  })

  let base64Data = req.body.pic.replace(/^data:image\/png;base64,/, '')
  fs.writeFile(picsDir + req.user.id + '.png', base64Data, 'base64', (err) => {
    if (err) console.log(err)
  })
}
