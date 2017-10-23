const TorrentSearch = require('torrent-search')
const model = require('../../models/queue.js')
const genUuid = require('uuid')
const map = require('async/map')
const t = new TorrentSearch()

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if ((req.query.type === 'movies' || req.query.type === 'series') &&
  (req.query.imdbId || req.query.query)) {
    t.getTorrents(
      req.query.imdbId ? req.query.imdbId : null,
      req.query.query ? req.query.query : null,
      req.query.type)
    .then(torrents => {
      if (torrents.length === 0) return error(res, 'No torrents', 404)
      map(torrents, (torrent, cb) => {
        if (torrent.quality === '3D') return cb(null, null)

        torrent.uuid = genUuid()
        model.getFromMagnet(torrent.magnet).then(result => {
          console.log(result)
          if (result.length === 0) {
            model.add(torrent).then(() => {
              return cb(null, {
                uuid: torrent.uuid,
                quality: torrent.quality
              })
            }).catch(err => cb(err, null))
          } else {
            return cb(null, {
              uuid: result[0].id,
              quality: torrent.quality
            })
          }
        })
      }, (err, magnet) => {
        if (err) {
          console.log(err)
          return error(res, 'Internal server error', 500)
        }
        res.json({
          success: true,
          result: magnet
        })
      })
    }).catch(err => {
      console.log(err)
      return error(res, 'Internal server error', 500)
    })
  } else {
    return error(res, 'Wrong args', 403)
  }
}
