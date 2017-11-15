const ffmpeg = require('fluent-ffmpeg')
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
    let convert = ffmpeg(file.createStream({
      start,
      end
    }))
      .videoCodec('libvpx')
      .audioCodec('libvorbis')
      .videoBitrate('512k')
      .format('webm')
      .outputOptions([
        '-deadline realtime',
        '-error-resilient 1'
      ])
      .on('start', () => {
        console.log(`'${file.title}' transcoding for ${req.user.id}...`)
      })
      .on('error', err => {
        if (err.message !== 'Output stream closed') {
          console.log(`Cannot convert '${file.title}' for ${req.user.id}...`)
          // console.log(err.message)
          model.update('state = ? WHERE id = ?', ['error', file.id]).then(result => {
            global.download[file.id].state = 'error'
            // console.log(err)
          }).catch(() => {
            // console.log(err)
          })
          convert.kill()
        }
      })
    pump(convert, res)
  } else {
    error(res, 'File error or bad gateway', 403)
  }
}
