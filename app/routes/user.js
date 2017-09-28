const express = require('express')
const router = express.Router()

router.post('/signup', require('../controllers/user/signup.js'))
router.post('/signin', require('../controllers/user/signin.js'))

module.exports = router
