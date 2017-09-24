const mysql = require('mysql')

var error
var db

let connect = (config) => {
  db = mysql.createConnection({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    debug: false
  })
  db.connect((err) => {
    if (err) {
      console.error('Error connecting: ' + err.stack)
      error = err.stack
    }
    if (db.threadId !== null) {
      console.log('Connected as id ' + db.threadId)
    } else {
      console.log('Connection to database failed!')
      process.exit(1)
    }
  })
  db.on('error', err => {
    console.log(err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      db = connect()
    }
  })
  return db
}

module.exports = {
  connect,
  get: () => {
    return new Promise((resolve, reject) => {
      if (error === undefined) {
        return resolve(db)
      } else {
        return reject(error)
      }
    })
  }
}
