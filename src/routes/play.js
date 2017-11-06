import React, { Component } from 'react'
import Player from '../components/player.js'
import Comment from '../components/comment.js'
import store from '../utils/store'
import { observer } from 'mobx-react'

@observer
class Play extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uuid: this.props.match.params.id,
      infoMoovie: store.moovie
    }
  }

  render () {
    return (
      <div>
        <Player history={this.props.history} uuid={this.props.match.params.id} />
        <Comment history={this.props.history} uuid={this.props.match.params.id} />
      </div>
    )
  }
}

export default Play
