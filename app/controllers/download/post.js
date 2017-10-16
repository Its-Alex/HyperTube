const torrentStream = require('torrent-stream')
const fs = require('fs')
let magnet = `magnet:?xt=urn:btih:9d07a24cca6b8a805ac86856378e6b9a2dd5f932&dn=Fear.The.Walking.Dead.S03E14.FRENCH.720p.HDTV.x264-SH0W.mkv&tr=udp://9.rarbg.com:2710/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://tracker.zer0day.to:1337&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://9.rarbg.me:2780/announce&tr=udp://ipv4.tracker.harry.lu:80/announce&tr=udp://tracker.trackerfix.com:85/announce`

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  let count = 0
  let engine = torrentStream(magnet, {
    connections: 100,
    uploads: 0,
    tmp: '/goinfre',
    path: '/goinfre'
  })

  engine.on('ready', (file) => {
    engine.files.forEach((file) => {
      if (file.name.indexOf('.avi') !== -1 ||
          file.name.indexOf('.mkv') !== -1) {
        let stream = file.createReadStream()

        // Method applied to each chunk of data
        stream.on('data', (data) => {
          // let stats = fs.statSync('/goinfre/[ Torrent9.tv ] Fear.The.Walking.Dead.S03E14.FRENCH.720p.HDTV.x264-SH0W.mkv')
          // console.log(stats.size)
        })

        // Show log when errors occur
        stream.on('error', err => {
          console.log(err)
        })
      }
    })
  })

  engine.on('idle', () => {
    console.log('Files downloaded')
  })
  res.json({success: true})
}
