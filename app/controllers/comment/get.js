const model = require('../../models/comment.js')

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (typeof req.params.id !== 'string' || req.params.id.length !== 36) {
    return error(res, 'Wrong id', '403')
  }

  model.get(req.params.id).then(result => {
    res.json({
      success: true,
      result
    })
  }).catch(err => {
    console.log(err)
    error(res, 'Internal server error', 500)
  })
}
