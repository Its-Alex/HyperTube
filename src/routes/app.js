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
        <Player src={`http://localhost:3005/download/${this.props.location.pathname.substr(1)}?Authorization=${global.localStorage.token}`} />
      </div>
    )
  }
}

export default App
