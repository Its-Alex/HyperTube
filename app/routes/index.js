const express = require('express')
const passport = require('passport')
const router = express.Router()
// const middle = require('../middlewares.js')

router.get('/', (req, res) => {
  res.json({
    success: true,
    version: 0.1,
    message: 'Hypertube API'
  })
})

// All paths
router.use('/auth', require('./auth.js'))
router.use('/user', require('./user.js'))
router.get('/test', (req, res) => {
  console.log(req.isAuthenticated())
  res.json({success: true})
})

module.exports = router
