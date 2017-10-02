const express = require('express')
const router = express.Router()

router.get('/movie', require('../controllers/search/movie.js'))
router.get('/serie', require('../controllers/search/serie.js'))

module.exports = router
