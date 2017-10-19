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

        // Set good quality
        if (result.quality === '1080') result.quality = '1080p'
        if (result.quality === '720') result.quality = '720p'
        if (result.quality === '440') result.quality = '440p'
        if (result.quality === '360') result.quality = '360p'
        if (result.quality === '240') result.quality = '240p'
        if (result.quality === '144') result.quality = '144p'
        
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
