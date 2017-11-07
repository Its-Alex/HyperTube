import React, { Component } from 'react'
import store from '../utils/store'
import Player from '../components/player.js'
import Comment from '../components/comment.js'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <button onClick={() => {
          store.addNotif('Error when adding', 'success')
        }}>Push notification</button>
        <Player src={`./Cardio_Time.mp4`} />
        <Comment />
      </div>
    )
  }
}

export default App
