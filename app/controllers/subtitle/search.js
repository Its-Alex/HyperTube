const path = require('path')
const fs = require('fs')
const langs = require('langs')
const axios = require('axios')
const each = require('async/each')
const srt2vtt = require('srt2vtt')
const genUuid = require('uuid')

const OS = require('opensubtitles-api')
const OpenSubtitles = new OS({ useragent: 'iziplay' })

const modelDownload = require('../../models/download.js')
const model = require('../../models/subtitle.js')

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

function addSub (sub, cb) {
  model.add(sub).then(res => {
    cb(null)
  }).catch(err => {
    console.log(err)
    cb(err)
  })
}

module.exports = (req, res) => {
  if (typeof req.query.id !== 'string' || req.query.id.length !== 36 ||
    typeof req.query.lang !== 'string' || req.query.lang === '') {
    return error(res, 'Invalid params', 403)
  }

  let lng
  if (req.query.lang.length === 2) {
    lng = langs.where(1, req.query.lang)
  } else if (req.query.lang.length === 3) {
    lng = langs.where(2, req.query.lang)
  } else {
    return error(res, 'Invalid lang', 403)
  }

  if (!lng) {
    return error(res, 'Lang not found', 404)
  }

  if (!fs.existsSync(global.config.pathStorage + 'subtitles')) {
    fs.mkdirSync(global.config.pathStorage + 'subtitles')
  }

  modelDownload.getFromId(req.query.id).then(result => {
    if (result.length === 0) return error(res, 'No movie for this id', 403)
    if (result[0].state === 'search') return error(res, 'Need to download movie first', 403)
    let file = result[0]

    model.getFromMovieAndLang(file.id, lng['1']).then(result => {
      if (result.length !== 0) {
        return res.json({
          success: true,
          result
        })
      }

      let timeout = true
      let timer = setTimeout(() => {
        timeout = false
        error(res, 'Server timeout', 408)
      }, 10000)

      OpenSubtitles.search({
        sublanguageid: lng['2B'],
        filesize: file.length,
        path: file.originalPath,
        filename: path.parse(file.originalPath).base,
        extensions: ['srt', 'vtt'],
        limit: 'all',
        imdbid: file.imdbId
      }).then(subtitles => {
        if (timeout) {
          clearTimeout(timer)
          each(subtitles[lng['1'].substr(0, 2)], (sub, cb) => {
            sub.movieId = req.query.id
            sub.uuid = genUuid()
            sub.path = global.config.pathStorage + 'subtitles/' + sub.uuid + '.vtt'

            axios.request({
              responseType: 'arraybuffer',
              url: sub.url,
              method: 'get',
              headers: {
                'Content-Type': 'text/plain'
              }
            }).then((result) => {
              if (path.extname(sub.filename) === '.srt') {
                srt2vtt(result.data, (err, vttData) => {
                  if (err) {
                    console.log(err)
                    return cb(null)
                  }
                  fs.writeFileSync(sub.path, vttData)
                  addSub(sub, cb)
                })
              } else {
                fs.writeFileSync(sub.path, result.data)
                addSub(sub, cb)
              }
            }).catch(err => {
              console.log(err)
              cb(null)
            })
          }, err => {
            if (err) {
              console.log(err)
              return error(res, 'Internal server error', 500)
            }
            model.getFromMovieAndLang(file.id, lng['1']).then(result => {
              res.json({
                success: true,
                result
              })
            }).catch(err => {
              console.log(err)
              error(res, 'Internal server error', 500)
            })
          })
        }
      }).catch(err => {
        console.log(err)
        if (timeout) {
          clearTimeout(timer)
          if (timeout) return error(res, 'Internal server error', 500)
        }
      })
    }).catch(err => {
      console.log(err)
      error(res, 'Internal server error', 500)
    })
  }).catch(err => {
    console.log(err)
    return error(res, 'Internal server error', 500)
  })
}
