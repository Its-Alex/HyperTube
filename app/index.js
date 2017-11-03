const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
const db = require('./utils/db.js')

require('./utils/cron.js')

global.config = JSON.parse(require('fs')
.readFileSync(require('path')
.resolve(require('path')
.dirname(__dirname), '.config.json'), 'UTF-8'))

const port = global.config.port || 3005

db.connect(global.config.db)

process.on('unhandledRejection', (reason, p) => {
  console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})

require('./utils/passport.js')

app.use(cors())
app.use(bodyParser.urlencoded({extended: true, limit: '512kb'}))
app.use(bodyParser.json({limit: '15mb'}))
app.use(passport.initialize())

// Global api route
app.use('/', require('./routes/index.js'))

// 404 not found api response
app.use((req, res) => {
  res.status(404)
  res.json({
    success: false,
    error: 'URL not found'
  })
})

// Start web server
app.listen(port, () => {
  console.log('Start at ' + port)
})
