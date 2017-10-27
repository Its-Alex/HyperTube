const express = require('express')
const router = express.Router()

router.put('/', require('../controllers/user/signup.js'))
router.post('/', require('../controllers/user/signin.js'))

router.use(require('../utils/middleware.js')())

router.patch('/', require('../controllers/user/update.js'))
router.get('/me', require('../controllers/user/get.js'))
router.get('/:id', require('../controllers/user/getOther.js'))

module.exports = router
