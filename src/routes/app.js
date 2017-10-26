import React, { Component } from 'react'
import Player from '../components/player.js'
import axios from 'axios'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <button onClick={() => {
          axios.get('http://localhost:3005/auth/link/facebook', {
            headers: {
              'Acces-Control-Allow-Origin': '*',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer ' + global.localStorage.token
            }
          }).then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err.response)
          })
        }}>Link 42</button>
      </div>
    )
  }
}
// <Player src='http://localhost:3005/download/asdaw' />

export default App
