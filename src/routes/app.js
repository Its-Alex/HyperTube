import React, { Component } from 'react'
import store from '../utils/store'
import Player from '../components/player.js'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <button onClick={() => {
          store.addNotif('Error when adding', 'success')
        }}>Push notification</button>
        <Player src='http://localhost:3005/download/asdaw' />
      </div>
    )
  }
}

export default App
