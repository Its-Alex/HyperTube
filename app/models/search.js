const db = require('../utils/db.js')

module.exports = {
  addQueue: (torrent) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('INSERT INTO queue (id, magnet, date) VALUES (?, ?, ?)', [
          torrent.uuid,
          torrent.magnet,
          Date.now()
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  }
}
