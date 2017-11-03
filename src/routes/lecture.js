import React, { Component } from 'react'
import Player from '../components/player.js'
import Comment from '../components/comment.js'

class Lecture extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  render () {
    return (
      <div>
        <Player />
        <Comment id={this.props.match.params.id} />
      </div>
    )
  }
}

export default Lecture
