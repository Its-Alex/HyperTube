const express = require('express')
const router = express.Router()

router.put('/', require('../controllers/user/signup.js'))
router.post('/', require('../controllers/user/signin.js'))
router.post('/forget', require('../controllers/user/forget.js'))
router.post('/reset', require('../controllers/user/reset.js'))

// Routes who needs auth
router.patch('/', require('../utils/middleware.js')(), require('../controllers/user/update.js'))
router.get('/me', require('../utils/middleware.js')(), require('../controllers/user/get.js'))
router.get('/:id', require('../utils/middleware.js')(), require('../controllers/user/getOther.js'))
router.delete('/logout', require('../utils/middleware.js')(), require('../controllers/user/logout.js'))

module.exports = router
