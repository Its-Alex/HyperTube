const axios = require('axios')


module.exports = () => {
  return axios.create({
    baseURL: 'https://api.trakt.tv/',
    timeout: 1000,
    headers: {
      'Content-type': 'application/json',
      'trakt-api-key': global.config.api.trakt.id,
      'trakt-api-version': 2
    }
  })
}
