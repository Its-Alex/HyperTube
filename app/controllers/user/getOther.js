const model = require('../../models/user.js')

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (typeof req.params.id !== 'string' || req.params.id.length !== 36) error(res, 'Wrong id', 403)

  model.getUserById(req.params.id).then(result => {
    if (result.length === 0) return error(res, 'No user found', 403)
    res.json({
      success: true,
      user: {
        id: result[0].id,
        mail: result[0].mail,
        username: result[0].username,
        firstName: result[0].firstName,
        lastName: result[0].lastName,
        date: result[0].date
      }
    })
  }).catch(err => {
    console.log(err)
    error(res, 'Internal server error', 500)
  })
}