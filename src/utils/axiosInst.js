import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'http://localhost:3005/',
    headers: {
      'Authorization': 'Bearer ' + global.localStorage.getItem('token')
    }
  })
}
