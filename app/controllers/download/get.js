const fs = require('fs')
const torrentStream = require('torrent-stream')
const each = require('async/each')

let magnet = `magnet:?xt=urn:btih:9d07a24cca6b8a805ac86856378e6b9a2dd5f932&dn=Fear.The.Walking.Dead.S03E14.FRENCH.720p.HDTV.x264-SH0W.mkv&tr=udp://9.rarbg.com:2710/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://tracker.zer0day.to:1337&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://9.rarbg.me:2780/announce&tr=udp://ipv4.tracker.harry.lu:80/announce&tr=udp://tracker.trackerfix.com:85/announce`
let extensions = ['.avi', '.mkv', '.mp4']

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (!req.params.id && !req.params.imdb) return error(res, 'Empty id', 403)

  /*
  ** Check if torrent has been downloaded
  ** if yes return a stream on file, if no download torrent and send stream on stream torrent
  */

  // Get range obtain by browser
  let range = req.headers.range
  if (!range) return error(res, 'Wrong range', 416)

  let positions = range.replace(/bytes=/, '').split('-')
  let engine = torrentStream(magnet/* Need to put magnet */, {
    connections: 100,
    uploads: 0,
    tmp: global.config.pathStorage,
    path: global.config.pathStorage + 'download'
  })
  engine.on('ready', () => {
    each(engine.files, (file, callback) => {
      each(extensions, (ext, cb) => {
        if (file.name.indexOf(ext) === -1) return cb()

        let start = parseInt(positions[0], 10)
        let end = positions[1] ? parseInt(positions[1], 10) : file.length - 1
        let chunksize = (end - start) + 1
        let head = {
          'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/' + ext.substr([1])
        }
        let stream = file.createReadStream({
          start,
          end
        })

        res.writeHead(206, head)
        stream.pipe(res)
        stream.on('error', (err) => console.log(err))

        cb()

        engine.on('idle', () => {
          // Save torrent in db/downloaded
        })
      }, err => {
        if (err) return callback(err)
        callback()
      })
    }, err => {
      if (err) {
        console.log(err)
        return error(res, 'Internal server error', 500)
      }
    })
  })
}
