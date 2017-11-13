function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  if (typeof req.params.id !== 'string' || req.params.id.length === '') {
    return error(res, 'Wrong id', '403')
  }

  return error(res, 'Route not integrated', 200)
}
