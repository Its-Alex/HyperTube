module.exports = (req, res) => {
  req.user.hasPassword = req.user.password !== null
  delete req.user.password
  res.json({
    success: true,
    user: req.user
  })
}
