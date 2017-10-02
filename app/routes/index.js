const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    success: true,
    version: 0.1,
    message: 'Hypertube API'
  })
})

// All paths
router.use('/auth', require('./auth.js'))
router.use('/user', require('./user.js'))
router.use('/picture', require('../utils/middleware.js')(), require('./picture.js'))

module.exports = router
