const ts = require('torrent-stream')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const pump = require('pump')
const genUuid = require('uuid')

const model = require('../../models/download.js')

let extensions = ['.avi', '.mkv', '.mp4', '.webm']

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (!req.params.id) return error(res, 'Invalid id', 403)

  model.getFromId(req.params.id).then(file => {
    if (file.length === 0) return error(res, 'No torrents with this id', 403)
    else file = file[0]

    if (file.state === 'search') {
      let movie
      let engine = ts(file.magnet, { tmp: global.config.pathStorage, path: global.config.pathStorage })

      engine.on('ready', () => {
        engine.files.forEach((fileToSelect, index) => {
          fileToSelect.deselect()
          if (index === 0) movie = fileToSelect
          if (fileToSelect.length > movie.length && extensions.indexOf(path.extname(fileToSelect.name)) !== -1) {
            movie = fileToSelect
          }
        })

        console.log(path.extname(movie.name))

        model.update('originalPath = ?, originalExt = ?, length = ?, state = ? WHERE id = ?', [
          global.config.pathStorage + movie.path,
          path.extname(movie.name),
          movie.length,
          'downloading',
          file.id
        ]).then(() => {
          if (path.extname(movie.name) === '.mp4' || path.extname(movie.name) === '.webm') {
            res.json({
              success: true,
              info: 'File downloading'
            })
            movie.createReadStream({
              start: 0,
              end: file.length
            })
          } else if (extensions.indexOf(path.extname(movie.name)) !== -1) {
            res.json({
              success: false,
              error: 'Need transcode'
            })
            // let uuid = genUuid()
            // let path = global.config.pathStorage + uuid + '.webm'
            // let stream = movie.createReadStream()

            // let ffmpeg = spawn('ffmpeg', [
            //   '-i', 'pipe:0',
            //   '-c:v', 'libvpx',
            //   '-b:v', '1M',
            //   '-c:a', 'libvorbis',
            //   path
            // ])
            // model.update('state = ?, path = ?, ext = ?, length = ? WHERE id = ?', [
            //   'transcoding',
            //   path,
            //   '.webm',
            //   0,
            //   file.id
            // ]).then(result => {
            //   pump(stream, ffmpeg.stdin)
            //   res.json({
            //     success: true,
            //     info: 'File downloading'
            //   })
            //   ffmpeg.stdout.on('data', r => {
            //     console.log(r.toString())
            //   })
            //   ffmpeg.stderr.on('data', r => {
            //     console.log(r.toString())
            //   })
            //   ffmpeg.on('close', () => {
            //     model.update('state = ?, length = ? WHERE id = ?', [
            //       'ready',
            //       fs.statSync(path).size,
            //       file.id
            //     ]).then(result => {
            //     }).catch(err => {
            //       console.log(err)
            //     })
            //   })
            // }).catch(err => {
            //   console.log(err)
            // })
          } else {
            error(res, 'Cannot use this movie', 200)
          }
        }).catch(err => {
          console.log(err)
          error(res, 'Internal server error', 500)
        })

        engine.on('idle', () => {
          model.getFromId(file.id).then(result => {
            if (result.length === 0) return
            result = result[0]
            if (result.state !== 'transcoding' && result.path && result.length && result.length === fs.statSync(result.path).size) {
              model.update('state = ? WHERE id = ?', ['ready', file.id]).then(result => {
              }).catch(err => {
                console.log(err)
              })
            }
          })
        })
      })
    } else {
      res.json({
        success: 200,
        info: 'File already downloaded'
      })
    }
  }).catch(err => {
    console.log(err)
    error(res, 'Internal server error', 500)
  })
}
