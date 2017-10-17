const torrentStream = require('torrent-stream')
const fs = require('fs')
const uuid = require('uuid')
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
  let id = uuid()
  let engine = torrentStream(magnet, {
    connections: 100,
    uploads: 0,
    tmp: global.config.pathStorage,
    path: global.config.pathStorage + 'download'
  })
  engine.on('ready', () => {
    each(engine.files, (file, callback) => {
      each(extensions, (ext, cb) => {
        if (file.name.indexOf(ext) === -1) return cb()
        file.createReadStream()
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

  engine.on('idle', () => {
    // Callback whebn file is downloaded
  })
  res.json({success: true})
}
