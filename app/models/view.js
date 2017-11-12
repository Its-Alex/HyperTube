const db = require('../utils/db.js')

module.exports = {
  add: (view) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('INSERT INTO viewed (imdbId, tmdbId, userId, date) VALUES (?, ?, ?, ?)', [
          view.imdbId,
          view.tmdbId,
          view.userId,
          Date.now()
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  getAllViewOfUser: (id) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('SELECT * FROM viewed WHERE userId = ?', [
          id
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  }
}
