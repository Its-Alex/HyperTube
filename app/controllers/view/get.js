const model = require('../../models/view')

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  model.getAllViewOfUser(req.user.id).then(result => {
    return res.json({
      success: true,
      result
    })
  }).catch(err => {
    console.log(err)
    return error(res, 'Internal server error', 500)
  })
}
