import React, { Component } from 'react'
import Player from '../components/player.js'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <Player src='http://localhost:3005/download/' />
      </div>
    )
  }
}

export default App
