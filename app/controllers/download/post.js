const ts = require('torrent-stream')
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const genUuid = require('uuid')

const model = require('../../models/download.js')

let extensions = ['.avi', '.mkv', '.mp4', '.webm']

function error (res, error, status) {
  res.status(status)
  return res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (!req.params.id) return error(res, 'Invalid id', 403)

  model.getFromId(req.params.id).then(file => {
    if (file.length === 0) return error(res, 'No torrents with this id', 403)
    else file = file[0]

    if (!global.download[file.id]) global.download[file.id] = file

    if (file.state === 'search' || file.state === 'downloading') {
      let movie
      let engine = ts(file.magnet, {
        tmp: global.config.pathStorage,
        path: global.config.pathStorage
      })

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
        global.download[file.id].createStream = movie.createReadStream

        model.update('originalPath = ?, originalExt = ?, length = ?, state = ? WHERE id = ?', [
          file.originalPath,
          file.originalExt,
          file.length,
          file.state,
          file.id
        ]).then(() => {
          if (file.originalExt === '.mp4' || file.originalExt === '.webm') {
            global.download[file.id].state = 'downloading'
            movie.select()
            console.log(`Movie ${movie.name} downloading...`)
            return res.json({
              success: true,
              info: 'downloading'
            })
          } else if (extensions.indexOf(file.originalExt) !== -1) {
            global.download[file.id].state = 'transcoding'
            global.download[file.id].path = global.config.pathStorage + genUuid() + '.mp4'
            global.download[file.id].ext = '.mp4'

            let size
            model.update('state = ?, path = ?, ext = ? WHERE id = ?', [
              global.download[file.id].state,
              global.download[file.id].path,
              global.download[file.id].ext,
              file.id
            ]).then(result => {
              let convert = ffmpeg(movie.createReadStream())
                .videoCodec('libvpx')
                .audioCodec('libvorbis')
                .videoBitrate('1024k')
                .format('webm')
                .outputOptions([
                  '-deadline realtime',
                  '-error-resilient 1'
                ])
                .on('start', (commandLine) => {
                  console.log(`Movie ${file.title} transcoding...`)
                  return res.json({
                    success: true,
                    info: 'transcoding'
                  })
                })
                .on('end', () => {
                  model.update('state = ?, lenght = ? WHERE id = ?', ['ready', size, file.id])
                  .then(result => {
                    global.download[file.id].length = size
                    global.download[file.id].state = 'ready'
                  }).catch(err => {
                    console.log(err)
                  })
                })
                .on('progress', (progress) => {
                  size = progress.targetSize
                })
                .on('error', (err) => {
                  convert.kill()
                  console.log('Failed to convert this movie')
                  model.update('state = ? WHERE id = ?', ['error', file.id]).then(result => {
                    global.download[file.id].state = 'error'
                    // console.log(err)
                  }).catch(() => {
                    // console.log(err)
                  })
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
            console.log(`Movie ${file.title} downloaded`)
            global.download[file.id].state = 'ready'
            model.update('state = ? WHERE id = ?', ['ready', file.id]).then(result => {
            }).catch(err => {
              console.log(err)
            })
          }
        })
      })
    } else if (file.state === 'ready') {
      return res.json({
        success: true,
        info: 'downloaded'
      })
    } else if (file.state === 'transcoding') {
      return res.json({
        success: true,
        info: 'transcoding'
      })
    } else {
      return error(res, 'File error', 403)
    }
  }).catch(err => {
    console.log(err)
    error(res, 'Internal server error', 500)
  })
}
