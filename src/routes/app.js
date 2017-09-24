import React, { Component } from 'react'
import axios from 'axios'

class App extends Component {
  render () {
    return (
      <div className='App'>
        Salut
      </div>
    )
  }

  componentWillMount () {
    axios.get('http://localhost:3005/test').then(res => {
      console.log(res.data)
    }).catch(err => console.log(err.response))
  }
  
}

export default App
