const db = require('../utils/db.js')

module.exports = {
  addToken: (id, token) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('INSERT INTO tokens (userId, token, date) VALUES (?, ?, ?)', [
          id,
          token,
          Date.now()
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  delToken: (id, token) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('DELETE FROM tokens WHERE userId = ? AND token = ?', [
          id,
          token,
          Date.now()
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  }
}
