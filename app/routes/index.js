const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    success: true,
    version: 0.1,
    message: 'Hypertube API'
  })
})

// Path with one method
router.get('/search', require('../utils/middleware.js')(), require('../controllers/search/get.js'))

// Path with multi methods
router.use('/auth', require('./auth.js'))
router.use('/user', require('./user.js'))
router.use('/picture', require('./picture.js'))
router.use('/download', require('./download.js'))
router.use('/comment', require('./comment.js'))
router.use('/view', require('./view.js'))
router.use('/subtitle', require('./subtitle.js'))

module.exports = router
