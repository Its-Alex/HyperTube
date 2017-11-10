const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
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

  if (file.state === 'transcoding') {
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
      'Content-Type': 'video/' + file.ext.substr(1)
    }

    res.writeHead(206, head)
    let convert = ffmpeg(file.createStream({start, end}))
      .videoCodec('libvpx')
      .audioCodec('libvorbis')
      .format('webm')
      // .audioBitrate(128)
      // .videoBitrate(1024)
      .outputOptions([
        '-threads 8',
        '-deadline realtime',
        '-error-resilient 1'
      ])
      .on('error', (err) => {
        console.log('Cannot convert movie ' + file.title)
        console.log(err)
      })
    pump(convert, res)
  } else {
    error(res, 'File error or bad gateway', 403)
  }
}
