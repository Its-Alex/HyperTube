const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const db = require('./utils/db.js')

global.config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.config.json'), 'UTF-8'))
const port = global.config.port || 3005

db.connect(global.config.db)

require('./utils/passport.js')

app.use(cors())
app.use(require('cookie-parser')())
app.use(bodyParser.urlencoded({extended: true, limit: '512kb'}))
app.use(bodyParser.json({limit: '5mb'}))
app.use(passport.initialize())

// Global api route
app.use('/', require('./routes/index.js'))

// 404 not found api response
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'URL not found'
  })
})

// Start web server
app.listen(port, () => {
  console.log('Start at ' + port)
})
