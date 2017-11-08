import React, { Component } from 'react'
import Player from '../components/player.js'
import Comments from '../components/comment.js'
import store from '../utils/store'
import { observer } from 'mobx-react'
import { tmdb, local } from '../utils/api.js'

@observer
class Play extends Component {
  constructor (props) {
    super(props)
    this.state = {
      uuid: this.props.match.params.uuid,
      id: this.props.match.params.id,
      src: ''
    }
  }
  
  componentWillMount () {
    local().get(`/download/one/${this.props.match.params.uuid}`).then(res => {
      if (res.data.state === 'transcoding') {
        this.setState({src: `http://localhost:3005/download/transcoding/${this.state.uuid}?Authorization=${global.localStorage.getItem('token')}`})
      } else {
        this.setState({src: `http://localhost:3005/download/${this.state.uuid}?Authorization=${global.localStorage.getItem('token')}`})        
      }
      if (store.movie === undefined || store.movie === null) {
        tmdb().get(`/movie/${this.state.id}`).then((res) => {
          store.addMovie(res.data)
        }).catch(err => {
          if (err.response) {
            console.log(err.response)
            store.addNotif(err.response.data.error)
          }
        })
      }
    }).catch(err => {
      if (err.response) {
        console.log(err.response)
        store.addNotif(err.response.data.error)
      }
    })
  }
  

  render () {
    return (
      <div>
        {(store.movie !== null && this.state.src !== '') ? (
            <Player history={this.props.history}
              id={this.props.match.params.uuid}
              tmdbid={this.props.match.params.id}
              src={this.state.src} />
        ) : null}
        <Comments history={this.props.history} uuid={this.props.match.params.uuid} />
      </div>
    )
  }
}

export default Play
