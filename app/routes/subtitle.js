const express = require('express')
const router = express.Router()

router.get('/search', require('../utils/middleware.js')(), require('../controllers/subtitle/search.js'))
router.get('/:id', require('../utils/middleware.js')(), require('../controllers/subtitle/get.js'))

module.exports = router
