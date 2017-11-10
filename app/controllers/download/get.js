const fs = require('fs')
const pump = require('pump')

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
  if (range) {
    range = range.replace(/bytes=/, '').split('-')
  }

  let file = global.download[req.params.id]
  if (!file) return error(res, 'Movie not cached', 404)

  if (!file.path && file.state === 'downloading') {
    let start
    let end
    let chunksize
    if (range) {
      start = parseInt(range[0], 10)
      end = range[1] ? parseInt(range[1], 10) : file.length - 1
      chunksize = (end - start) + 1
    } else {
      start = 0
      end = file.length - 1
      chunksize = (end - start) + 1
    }
    let head = {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/' + file.originalExt.substr(1)
    }

    res.writeHead(206, head)
    pump(file.createStream({
      start,
      end
    }), res)
  } else if (file.state === 'ready') {
    if (!fs.existsSync(file.path || file.originalPath)) {
      return error(res, 'Movie not found in our server', 404)
    }

    let start
    let end
    let chunksize
    let ext
    if (range) {
      start = parseInt(range[0], 10)
      end = range[1] ? parseInt(range[1], 10) : file.length - 1
      chunksize = (end - start) + 1
    } else {
      start = 0
      end = file.length - 1
      chunksize = (end - start) + 1
    }
    if (file.originalExt) ext = file.originalExt.substr(1)
    if (file.ext) ext = file.ext.substr(1)
    let head = {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/' + ext
    }

    res.writeHead(206, head)
    pump(fs.createReadStream(file.path || file.originalPath, {
      start,
      end
    }), res)
  } else {
    error(res, 'File error or bad gateway', 403)
  }
}
