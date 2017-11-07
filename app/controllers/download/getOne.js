const model = require('../../models/download.js')

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (!req.params.id) return error(res, 'Invalid id', 403)

  model.getFromId(req.params.id).then(result => {
    res.json({
      success: true,
      result
    })
  }).catch(err => {
    console.log(err)
    error(res, 'Internal server error', 500)
  })
}
