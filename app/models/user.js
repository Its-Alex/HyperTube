const db = require('../utils/db.js')

module.exports = {
  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('SELECT * FROM users WHERE id = ?', [id], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  getUserByMail: (mail) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('SELECT * FROM users WHERE mail = ?', [mail], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  getUserByOauth: (id) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('SELECT * FROM users WHERE id_github = ? OR id_42 = ? OR id_facebook = ?', [id, id, id], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  getUserByToken: (token) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('SELECT * FROM users INNER JOIN tokens ON users.id = tokens.userId WHERE tokens.token = ?', [token], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  addUser: (user) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('INSERT INTO users (id, mail, username, firstName, lastName, password, id_42, id_github, id_facebook, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
          user.id,
          user.mail,
          user.username,
          user.firstName,
          user.lastName,
          user.password,
          user.id_42,
          user.id_github,
          user.id_facebook,
          Date.now()
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  updateUser: (user) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('UPDATE users SET mail = ?, username = ?, firstName = ?, lastName = ?, password = ? WHERE id = ?', [
          user.mail,
          user.username,
          user.firstName,
          user.lastName,
          user.password,
          user.id
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  updatePassword: (id, pwd) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('UPDATE users SET password = ? WHERE id = ?', [
          pwd,
          id
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  updateFortyTwoId: (userId, id) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('UPDATE users SET id_42 = ? WHERE id = ?', [
          id,
          userId
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  updateGithubId: (userId, id) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('UPDATE users SET id_github = ? WHERE id = ?', [
          id,
          userId
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  },
  updateFacebookId: (userId, id) => {
    return new Promise((resolve, reject) => {
      db.get().then(db => {
        db.query('UPDATE users SET id_facebook = ? WHERE id = ?', [
          id,
          userId
        ], (err, res) => {
          if (err) reject(err)
          resolve(res)
        })
      }).catch(err => reject(err))
    })
  }
}
