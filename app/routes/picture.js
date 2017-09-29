const express = require('express')
const router = express.Router()

router.get('/:id', require('../controllers/picture/get.js'))
router.post('/', require('../utils/middleware.js')(), require('../controllers/picture/post.js'))
router.delete('/', require('../utils/middleware.js')(), require('../controllers/picture/delete.js'))

module.exports = router
