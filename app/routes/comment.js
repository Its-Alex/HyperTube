const express = require('express')
const router = express.Router()

router.post('/:id', require('../utils/middleware.js')(), require('../controllers/comment/post.js'))
router.get('/:id', require('../controllers/comment/get.js'))
router.delete('/:id', require('../utils/middleware.js')(), require('../controllers/comment/delete.js'))

module.exports = router
