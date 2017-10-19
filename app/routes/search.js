const express = require('express')
const router = express.Router()

router.put('/movie/:id', require('../controllers/search/movie.js'))
router.put('/serie/:id', require('../controllers/search/serie.js'))
router.get('/get', require('../controllers/search/get.js'))

module.exports = router
