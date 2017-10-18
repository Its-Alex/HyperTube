const express = require('express')
const router = express.Router()

router.get('/:id', require('../controllers/picture/get.js'))
router.put('/', require('../utils/middleware.js')(), require('../controllers/picture/put.js'))
router.delete('/', require('../utils/middleware.js')(), require('../controllers/picture/delete.js'))

module.exports = router
