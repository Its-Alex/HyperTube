const ts = require('torrent-stream')
const fs = require('fs')
const path = require('path')

const model = require('../../models/download.js')

let extensions = ['.avi', '.mkv', '.mp4', '.webm']

function error(res, error, status) {
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
      let engine = ts(file.magnet, {
        tmp: global.config.pathStorage,
        path: global.config.pathStorage
      })

      engine.on('idle', () => {
        model.update('state = ? WHERE id = ?', ['ready', file.id]).then(result => {
        }).catch(err => {
          console.log(err)
          error(res, 'Internal server error', 500)
        })
      })

      engine.on('ready', () => {
        engine.files.forEach((fileToSelect, index) => {
          if (index === 0) movie = fileToSelect
          if (fileToSelect.length > movie.length && extensions.indexOf(path.extname(fileToSelect.name)) !== -1) {
            movie = fileToSelect
          }
        })

        model.update('path = ?, ext = ?, length = ?, state = ? WHERE id = ?', [
          global.config.pathStorage,
          path.extname(movie.name),
          movie.length,
          'downloading',
          file.id
        ]).then(() => {
          res.json({
            success: true,
            info: 'File downloading'
          })
          movie.select()
          // ffmpeg.ffprobe(global.config.pathStorage + movie.path, (err, metadata) => {
          //   if (err) console.log(err)
          //   console.log(metadata)
          // })
        }).catch(err => {
          console.log(err)
          error(res, 'Internal server error', 500)
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
