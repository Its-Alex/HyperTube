const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const db = require('./utils/db.js')
const fs = require('fs')
const port = 3005

const config = JSON.parse(fs.readFileSync('./app/.config.json', 'utf8'))

db.connect(config.db)

app.disable('x-powered-by')

app.use(cors())
app.use(bodyParser.urlencoded({extended: true, limit: '512kb'}))
app.use(bodyParser.json({limit: '5mb'}))

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

// End connecton with database
process.on('SIGINT', () => {
  db.end()
  process.exit()
})
