import axios from 'axios'

module.exports = () => {
  axios.create({
    baseURL: 'http://localhost:3005/',
    headers: {
      'Authorization': 'Bearer ' + global.localStorage.getItem('token')
    }
  })
}
