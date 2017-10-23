const db = require('../utils/db.js')

module.exports = {
  add: (torrent) => {
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
  },
  getFromMagnet: (magnet) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('SELECT * FROM queue WHERE magnet = ?', [
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
        db.query('SELECT * FROM queue WHERE id = ?', [
          id
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  }
}
