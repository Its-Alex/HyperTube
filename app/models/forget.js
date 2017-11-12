const db = require('../utils/db.js')

module.exports = {
  add: obj => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('INSERT INTO forget (userId, token, date) VALUES (?, ?, ?)', [
          obj.userId,
          obj.token,
          Date.now()
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  get: (id) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('SELECT * FROM forget WHERE userId = ?', [
          id
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  getByToken: hash => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('SELECT * FROM forget WHERE token = ?', [
          hash
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('DELETE FROM forget WHERE userId = ?', [
          id
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  }
}
