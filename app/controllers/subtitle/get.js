const model = require('../../models/subtitle.js')
const fs = require('fs')

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (typeof req.params.id !== 'string' || req.params.id.length !== 36) {
    return error(res, 'Invalid movie id', 403)
  }
  model.get(req.params.id).then(result => {
    if (result.length === 0) return error(res, 'No subtitle with this id', 404)
    let sub = result[0]
    if (!fs.existsSync(sub.path)) return error(res, 'Subtitle not found on server sorry :(', 404)

    res.set('Content-type', 'text/vtt')
    res.send(fs.readFileSync(sub.path))
  }).catch(err => {
    console.log(err)
    error(res, 'Internal server error', 500)
  })
}
