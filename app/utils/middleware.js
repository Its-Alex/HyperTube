const model = require('../models/user.js')

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = () => {
  return (req, res, next) => {
    var auth = req.get('Authorization')

    if (auth === undefined) {
      return error(res, 'Need Authorization in header', 401)
    }
    auth = auth.split(' ')
    if (auth[0] !== 'Bearer' || auth[1].length !== 128 || auth.length !== 2) {
      return error(res, 'Wrong authorization header', 401)
    }

    model.getUserByToken(auth[1]).then(results => {
      if (results.length <= 0) return error(res, 'Wrong token', 401)
      req.user = {
        token: auth[1],
        id: results[0].userId,
        mail: results[0].mail,
        username: results[0].username,
        firstName: results[0].firstName,
        lastName: results[0].lastName,
        password: results[0].password
      }
      next()
    }).catch(err => {
      console.log(err)
      return error(res, 'Internal server error', 500)
    })
  }
}
