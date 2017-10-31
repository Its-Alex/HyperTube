const modelToken = require('../../models/token.js')

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  modelToken.delToken(req.user.id, req.user.token).then(result => {
    res.json({success: true})
  }).catch(err => {
    console.log(err)
    error(res, 'Internal server error', 500)
  })
}
