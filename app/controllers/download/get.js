const fs = require('fs')

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  let file = './public/toystory.mp4'

  fs.stat(file, (err, stats) => {
    if (err) {
      // If file no exist
      if (err.code === 'ENOENT') {
        return res.sendStatus(404)
      }
    }

    // Get range obtain by browser
    let range = req.headers.range

    // Check if navigator ask for a range
    if (!range) {
      console.log(new Error('Wrong range'))
      return error(res, 'Wrong range', 416)
    }
    // Convert range into array
    let positions = range.replace(/bytes=/, '').split('-')

    let start = parseInt(positions[0], 10)
    let end = positions[1] ? parseInt(positions[1], 10) : stats.size - 1
    let chunksize = (end - start) + 1
    let head = {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + stats.size,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4'
    }
    res.writeHead(206, head)
    let stream = fs.createReadStream(file, {
      start: start,
      end: end
    })
    stream.on('open', () => {
      stream.pipe(res)
    })
    stream.on('error', (err) => {
      console.log(err)
      return error(res, 'Internal server error', 500)
    })
  })
}
