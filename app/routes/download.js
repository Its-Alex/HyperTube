const express = require('express')
const router = express.Router()

router.get('/:id', require('../controllers/download/get.js'))
router.post('/', require('../controllers/download/post.js'))
router.delete('/', require('../controllers/download/delete.js'))

module.exports = router
