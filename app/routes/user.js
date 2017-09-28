const express = require('express')
const router = express.Router()

router.post('/signup', require('../controllers/user/signup.js'))
router.post('/signin', require('../controllers/user/signin.js'))

router.use(require('../utils/middleware.js')())

router.patch('/update', require('../controllers/user/update.js'))

module.exports = router
