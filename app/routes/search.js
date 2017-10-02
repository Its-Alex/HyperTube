const express = require('express')
const router = express.Router()

router.get('/popular', require('../controllers/search/popular.js'))
router.get('/movie/:id', require('../controllers/search/movie.js'))
router.get('/serie/:id', require('../controllers/search/serie.js'))
router.get('/movies', require('../controllers/search/movies.js'))
router.get('/series', require('../controllers/search/series.js'))

module.exports = router
