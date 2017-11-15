const TorrentSearch = require('torrent-search')
const map = require('async/map')
const genUuid = require('uuid')

const t = new TorrentSearch()

const model = require('../../models/download.js')

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (typeof req.query.tmdbId !== 'string' || req.query.tmdbId === '' ||
    typeof req.query.title !== 'string' || req.query.title === '' ||
    typeof req.query.imdbId !== 'string' || req.query.imdbId === '' ||
    typeof req.query.type !== 'string' || req.query.type === '') return error(res, 'Invalid fields', 403)

  if (req.query.type !== 'movies' && req.query.type !== 'series') {
    return error(res, 'Wrong args', 403)
  }

  let timeout = false

  let funcTimeout = setTimeout(() => {
    timeout = true
    error(res, 'Server timedout', 408)
  }, 10000)

  t.getTorrents(
    req.query.imdbId,
    null,
    req.query.type)
  .then(torrents => {
    if (torrents.length === 0) {
      if (timeout === false) {
        clearTimeout(funcTimeout)
        return error(res, 'No torrents', 404)
      }
    }
    map(torrents, (torrent, cb) => {
      if (torrent.quality === '3D') return cb(null, null)

      let elem = {
        id: genUuid(),
        imdb: req.query.imdbId,
        tmdb: req.query.tmdbId,
        title: req.query.title,
        quality: torrent.quality,
        magnet: torrent.magnet
      }

      model.getFromMagnet(elem.magnet).then(result => {
        if (result.length === 0) {
          model.add(elem).then(() => {
            return cb(null, {
              uuid: elem.id,
              quality: elem.quality,
              state: 'search'
            })
          }).catch(err => cb(err, null))
        } else {
          return cb(null, {
            uuid: result[0].id,
            quality: elem.quality,
            state: result[0].state
          })
        }
      })
    }, (err, magnet) => {
      if (err) {
        console.log(err)
        if (timeout === false) {
          clearTimeout(funcTimeout)
          return error(res, 'Internal server error', 500)
        }
      }
      if (timeout === false) {
        clearTimeout(funcTimeout)
        res.json({
          success: true,
          result: magnet.filter(p => p)
        })
      }
    })
  }).catch(err => {
    console.log(err)
    if (timeout === false) {
      clearTimeout(funcTimeout)
      return error(res, 'Internal server error', 500)
    }
  })
}
