const TorrentSearch = require('torrent-search')
const model = require('../../models/search.js')
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
    .then(results => {
      map(results, (result, cb) => {
        if (result.quality === '3D') return cb(null, null)

        result.uuid = genUuid()
        model.addQueue(result).then(() => {
          cb(null, {
            uuid: result.uuid,
            quality: result.quality
          })
        }).catch(err => cb(err, null))
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
