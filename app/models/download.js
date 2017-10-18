const db = require('../utils/db.js')

module.exports = {
  addToQueue: (movie) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('INSERT INTO queue (id, imdbId, magnet, date) VALUES (?, ?, ?, ?)', [
          movie.id,
          movie.imdb,
          movie.magnet,
          Date.now()
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  addToDownloaded: (movie) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('INSERT INTO downloaded (imdbId, path, format, date) VALUES (?, ?, ?, ?)', [
          movie.imdb,
          movie.path,
          movie.format,
          Date.now()
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  }
  // getMovieQueueFromId: (id) => {
  //   return new Promise((resolve, reject) => {
  //     db.get().then(db => {
  //       db.query('SELECT * FROM queue WHERE id = ?', [
  //         id
  //       ], (err, res) => {
  //         if (err) reject(err)
  //         resolve(res)
  //       })
  //     }).catch(err => reject(err))
  //   })
  // },
  // getMovieQueueFromImdb: (imdb) => {
  //   return new Promise((resolve, reject) => {
  //     db.get().then(db => {
  //       db.query('SELECT * FROM queue WHERE imdbId = ?', [
  //         imdb
  //       ], (err, res) => {
  //         if (err) reject(err)
  //         resolve(res)
  //       })
  //     }).catch(err => reject(err))
  //   })
  // },
  // getMovieDownloaded: (id) => {
  //   return new Promise((resolve, reject) => {
  //     db.get().then(db => {
  //       db.query('', [
  //       ], (err, res) => {
  //         if (err) reject(err)
  //         resolve(res)
  //       })
  //     }).catch(err => reject(err))
  //   })
  // }
}
