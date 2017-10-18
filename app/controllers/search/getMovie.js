const TorrentSearch = require('torrent-search')
const t = new TorrentSearch()

function error (res, error, status) {
  res.status(status)
  res.json({
    success: false,
    error
  })
}

module.exports = (req, res) => {
  t.getTorrents().then(res => console.log(res)).catch(err => console.log(err))
  res.json({success: true})
}
