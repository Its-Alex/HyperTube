const express = require('express')
const router = express.Router()

router.put('/movie/:id', require('../controllers/search/movie.js'))
router.put('/serie/:id', require('../controllers/search/serie.js'))
router.get('/getMovie/:id', require('../controllers/search/getMovie.js'))
router.get('/getSerie/:id', require('../controllers/search/getSerie.js'))

module.exports = router
