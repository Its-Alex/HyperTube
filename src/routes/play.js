import React, { Component } from 'react'
import Player from '../components/player.js'
import Comment from '../components/comment.js'
import store from '../utils/store'
import { observer } from 'mobx-react'
import { tmdb } from '../utils/api.js'

@observer
class Play extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uuid: this.props.match.params.uuid,
      id: this.props.match.params.id
    }
  }
  
  componentWillMount () {
    if (store.moovie[0] === undefined) {
      tmdb().get(`/movie/${this.props.match.params.id}`).then((res) => {
        store.addMoovie(res.data)
      }).catch((err) => {
        console.log(err.response)
      })
    }
  }
  

  render () {
    return (
      <div>
        <Player history={this.props.history} uuid={this.props.match.params.uuid} />
        <Comment history={this.props.history} uuid={this.props.match.params.uuid} />
      </div>
    )
  }
}

export default Play
