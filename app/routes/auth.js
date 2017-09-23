const express = require('express')
const router = express.Router()
// const middle = require('../middlewares.js')

// All paths
router.get('/42', (req, res) => {
  console.log('hello')
})

module.exports = router
