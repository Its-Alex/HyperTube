const ts = require('torrent-stream')
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
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

        file.originalPath = global.config.pathStorage + movie.path
        file.originalExt = path.extname(movie.name)
        file.length = movie.length
        file.state = 'downloading'

        global.download[file.id] = file
        global.download[file.id].file = movie

        model.update('originalPath = ?, originalExt = ?, length = ?, state = ? WHERE id = ?', [
          file.originalPath,
          file.originalExt,
          file.length,
          file.state,
          file.id
        ]).then(() => {
          if (file.originalExt === '.mp4' || file.originalExt === '.webm') {
            res.json({
              success: true,
              info: 'downloading'
            })
            movie.select()
          } else if (extensions.indexOf(file.originalExt) !== -1) {
            console.log('Need transcode for:' + file.name)
            global.download[file.id].needTranscode = true
            global.download[file.id].state = 'transcoding'
            global.download[file.id].path = global.config.pathStorage + genUuid() + '.webm'
            global.download[file.id].ext = '.webm'

            model.update('state = ?, path = ?, ext = ? WHERE id = ?', [
              global.download[file.id].state,
              global.download[file.id].path,
              global.download[file.id].ext,
              file.id
            ]).then(result => {
              ffmpeg(movie.createReadStream())
                .videoCodec('libvpx')
                .audioCodec('libvorbis')
                .format('webm')
                .audioBitrate(128)
                .videoBitrate(1024)
                .outputOptions([
                  '-deadline realtime',
                  '-error-resilient 1'
                ])
                .on('start', (commandLine) => {
                  console.log('Spawned Ffmpeg with command: ' + commandLine)
                  res.json({
                    success: true,
                    info: 'transcoding'
                  })
                })
                .on('end', function () {
                  model.update('state = ? WHERE id = ?', ['ready', file.id])
                  .then(result => {
                    global.download[file.id].file.state = 'ready'
                  }).catch(err => {
                    console.log(err)
                  })
                })
                // .on('codecData', function (data) {
                //   console.log(data)
                // })
                .on('progress', function (progress) {
                  console.log(progress)
                })
                .on('error', function (err) {
                  console.log('Cannot convert movie')
                  console.log(err)
                })
                .save(global.download[file.id].path)
            }).catch(err => {
              console.log(err)
            })
          } else {
            error(res, 'Cannot use this movie', 200)
          }
        }).catch(err => {
          console.log(err)
          error(res, 'Internal server error', 500)
        })

        engine.on('idle', () => {
          if (file.state !== 'ready' && file.state !== 'transcode' && file.originalPath && file.length && file.length === fs.statSync(file.originalPath).size) {
            global.download[file.id].state = 'ready'
            model.update('state = ? WHERE id = ?', ['ready', file.id]).then(result => {
            }).catch(err => {
              console.log(err)
            })
          }
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
