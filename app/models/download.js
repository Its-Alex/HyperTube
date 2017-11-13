const db = require('../utils/db.js')

module.exports = {
  add: (movie) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('INSERT INTO download (id, imdbId, tmdbId, title, quality, magnet, date) VALUES (?, ?, ?, ?, ?, ?, ?)', [
          movie.id,
          movie.imdb,
          movie.tmdb,
          movie.title,
          movie.quality,
          movie.magnet,
          Date.now()
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  getFromMagnet: (magnet) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('SELECT * FROM download WHERE magnet = ?', [
          magnet
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  getFromId: (id) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('SELECT * FROM download WHERE id = ?', [
          id
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  update: (name, value) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('UPDATE download SET ' + name, value, (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  cronDelete: (date) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query(`DELETE download FROM download INNER JOIN viewed ON download.tmdbId = viewed.tmdbId WHERE viewed.date <= ?`, [
          date
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  }
}
