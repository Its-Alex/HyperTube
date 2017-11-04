const express = require('express')
const router = express.Router()

router.get('/:id', require('../utils/middleware.js')(), require('../controllers/comment/get.js'))
router.put('/:id', require('../utils/middleware.js')(), require('../controllers/comment/put.js'))
router.delete('/:id', require('../utils/middleware.js')(), require('../controllers/comment/delete.js'))

module.exports = router
