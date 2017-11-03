const db = require('../utils/db.js')

module.exports = {
  add: (sub) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('INSERT INTO subtitles (id, movieId, path, lang, encoding, score, date) VALUES (?, ?, ?, ?, ?, ?, ?)', [
          sub.uuid,
          sub.movieId,
          sub.path,
          sub.langcode,
          sub.encoding,
          sub.score,
          Date.now()
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  }
}