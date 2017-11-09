const db = require('../utils/db.js')

module.exports = {
  add: (comment) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('INSERT INTO comments (userId, movieId, comment, date) VALUES (?, ?, ?, ?)', [
          comment.userId,
          comment.movieId,
          comment.text,
          Date.now()
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
        db.query('DELETE FROM comments WHERE id = ?', [
          id
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
        db.query(`SELECT
comments.id,
comments.userId,
comments.movieId,
comments.comment,
comments.date,
users.username
FROM comments
INNER JOIN download 
ON download.id = comments.movieId
INNER JOIN users
ON comments.userId = users.id
WHERE comments.movieId = ?
ORDER BY comments.date DESC`,
          [
            id
          ], (err, res) => {
            if (err) reject(err)
            resolve(res)
          })
      }).catch(err => reject(err))
    })
  }
}
