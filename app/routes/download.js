const express = require('express')
const router = express.Router()

router.get('/:id', require('../controllers/download/get.js'))
router.delete('/', require('../utils/middleware.js')(), require('../controllers/download/delete.js'))

module.exports = router
