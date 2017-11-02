import axios from 'axios'

export let tmdb = () => {
  return axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    params: {
      include_adult: false,
      include_video: false,
      api_key: '4add767f00472cadffc84346bd8572e6',
      language: global.localStorage.getItem('langue')
    }
  })
}
export let local = () => {
  return axios.create({
    baseURL: 'http://localhost:3005/',
    headers: {
      'Authorization': 'Bearer ' + global.localStorage.getItem('token')
    }
  })
}
