import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { local } from '../utils/api'

import store from '../utils/store.js'

@observer
class Player extends Component {
  constructor (props) {
    super(props)
    this.state = {
      played: false,
      subs: []
    }
    this.ChangePlayed = this.ChangePlayed.bind(this)
  }

  
  componentWillMount () {
    local().get('/subtitle/search', {
      params: {
        id: this.props.id,
        lang: global.localStorage.getItem('langue')
      }
    }).then(res => {
      this.setState({subs: res.data.result})
    }).catch(err => {
      if (err.response) {
        console.log(err.response)
        store.addNotif(err.response.data.error)
      }
    })
  }
  
  componentWillReceiveProps (nextProps) {
    console.log(nextProps)
  }
  

  componentDidMount () {
    window.addEventListener('keypress', this.ChangePlayed)
  }

  componentWillUnmount () {
    window.removeEventListener('keypress', this.ChangePlayed)
  }

  ChangePlayed (evt) {
    if (this.video) {
      if (evt.code === 'Space' && this.video.paused) this.video.play()
      else if (evt.code === 'Space' && !this.video.paused) this.video.pause()
    }
  }

  render () {
    return (
      <div>
        <video ref={(ref) => { this.video = ref }} autoPlay controls crossOrigin='anonymous' poster={store.movie.back} >
          <source src={this.props.src} />
          {this.state.subs.map((sub, index) => {
            let src = `http://localhost:3005/subtitle/${sub.id}?Authorization=${global.localStorage.getItem('token')}`
            let srcLang = global.localStorage.getItem('lamguage')
            if (index === 0) {
              return <track key={index} default label={sub.lang} src={src} srcLang={srcLang} />
            }
            return <track key={index} label={sub.lang} src={src} srcLang={srcLang} />
          })
          }
        </video>
      </div>
    )
  }
}

export default Player
