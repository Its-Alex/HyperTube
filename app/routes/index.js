const express = require('express')
const router = express.Router()
// const middle = require('../middlewares.js')

router.get('/', (req, res) => {
  res.json({
    success: true,
    version: 0.1,
    message: 'Hypertube API'
  })
})

// All paths
router.use('/auth', require('./auth.js'))

module.exports = router
