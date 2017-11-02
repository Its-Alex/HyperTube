const fs = require('fs')
const pump = require('pump')

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

  // Get range obtain by browser
  let range = req.headers.range
  if (!range) return error(res, 'Invalid range', 416)
  else range = range.replace(/bytes=/, '').split('-')

  model.getFromId(req.params.id).then(file => {
    if (file.length === 0) return error(res, 'No torrents with this id', 403)
    else file = file[0]

    if (file.state !== 'search') {
      let start = parseInt(range[0], 10)
      let end = range[1] ? parseInt(range[1], 10) : file.length - 1
      let chunksize = (end - start) + 1
      let head = {
        'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/' + file.ext
      }

      res.writeHead(206, head)
      pump(fs.createReadStream(file.path, {
        start,
        end
      }), res)
    } else {
      error(res, 'File not downloaded', 500)
    }
  }).catch(err => {
    console.log(err)
    error(res, 'Internal server error', 500)
  })
}
