const express = require('express')
const router = express.Router()

router.get('/', require('../utils/middleware.js')(), require('../controllers/view/get.js'))
router.put('/', require('../utils/middleware.js')(), require('../controllers/view/put.js'))

module.exports = router
