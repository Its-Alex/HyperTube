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
router.use('/picture', require('./picture.js'))
router.use('/search', require('../utils/middleware.js')(), require('./search.js'))
router.use('/download', require('../utils/middleware.js')(), require('./download.js'))

module.exports = router
