const axios = require('axios')


module.exports = {
  tmdb: () => {
    return axios.create({
      baseURL: 'https://api.themoviedb.org/3/',
      timeout: 1000
    })
  },
  tmdbImg: () => {
    return axios.create({
      baseURL: 'https://image.tmdb.org/t/p/',
      timeout: 1000
    })
  }
}
