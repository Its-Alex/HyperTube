import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { local } from '../utils/api'

import store from '../utils/store.js'

@observer
class Player extends Component {
  constructor (props) {
    super(props)
    this.state = {
      localMovie: null,
      played: false,
      subs: []
    }
    let self = this
    this._isMounted = false
    setTimeout(() => {
      if (self.video && self.video.paused) self.video.play()
    }, 3000)
  }

  
  componentDidMount () {
    this._isMounted = true
    local().get(`/download/one/${this.props.id}`).then(res => {
      if (res.data.success === true) {
        if (this._isMounted === true) this.setState({ localMovie: res.data.result })
      } else {
        store.addNotif(res.data.error, 'error')
      }
    }).catch(err => {
      if (err.response) {
        store.addNotif(err.response.data.error, 'error')
      }
    })
    if (!global.localStorage.getItem('langue')) {
      global.localStorage.setItem('langue', 'en')
    }
    local().get('/subtitle/search', {
      params: {
        id: this.props.id,
        lang: global.localStorage.getItem('langue')
      }
    }).then(res => {
      if (res.data.success === true) {
        if (this._isMounted === true) this.setState({ subs: res.data.result })
      } else {
        store.addNotif(res.data.error, 'error')
      }
    }).catch(err => {
      if (err.response) {
        store.addNotif(err.response.data.error, 'error')
      }
    })
    if (this.video) {
      let self = this
      if (global.localStorage.getItem('volume')) {
        this.video.volume = global.localStorage.getItem('volume')
      } else {
        this.video.volume = 0.8
      }
      this.video.addEventListener('volumechange', (volume) => {
        global.localStorage.setItem('volume', this.video.volume)
      })
      if (this.props.src.indexOf('transcod') !== -1) {
        this.video.addEventListener('pause', (e) => {
          e.preventDefault()
          if (self.video && self.video.currentTime > 0 && self.video.paused && !self.video.ended
            && self.video.readyState > 2) self.video.play()
        })
      }
      this.video.addEventListener('error', (err) => {
        this.props.history.goBack()
        store.addNotif('An error occured in this video!', 'error')
      })
    }
  }

  componentWillUnmount () {
    this._isMounted = false
    clearInterval(this.timer)
  }
  

  render () {
    return (
      <div>
        <video id='player' ref={(ref) => { this.video = ref }} autoPlay controls crossOrigin='anonymous' poster={`https://image.tmdb.org/t/p/w1000/${store.movie.backdrop_path}`} >
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
        {this.state.subs.length === 0
          ? <p>There is no subtitles for this movie</p>
          : null}
      </div>
    )
  }
}

export default Player
