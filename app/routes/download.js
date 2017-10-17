const express = require('express')
const router = express.Router()

router.get('/', require('../controllers/download/get.js'))
router.post('/', require('../utils/middleware.js')(), require('../controllers/download/post.js'))
router.delete('/', require('../utils/middleware.js')(), require('../controllers/download/delete.js'))

module.exports = router
