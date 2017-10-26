import axios from 'axios'

export default () => {
  axios.create({
    baseURL: 'http://localhost:3005/',
    headers: {
      'Authorization': 'Bearer ' + global.localStorage.getItem('token')
    }
  })
}
