const model = require('../../models/view')

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (typeof req.body.imdbId !== 'string' || req.body.imdbId === ''
  || typeof req.body.tmdbId !== 'string' || req.body.tmdbId === '') {
    return error(res, 'Invalid params', 403)
  }

  model.getAllViewOfUser(req.user.id).then(result => {
    let exist = false
    result.forEach(elmt => {
      if (elmt.tmdbId === req.body.tmdbId) exist = true
    })
    if (exist === false) {
      model.add({
        imdbId: req.body.imdbId,
        tmdbId: req.body.tmdbId,
        userId: req.user.id
      }).then(result => {
        res.json({ success: true })
      }).catch(err => {
        console.log(err)
        return error(res, 'Internal server error', 500)
      })
    }
  }).catch(err => {
    console.log(err)
    return error(res, 'Internal server error', 500)
  })
}
