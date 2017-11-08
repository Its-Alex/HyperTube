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
      if (res.data.success === true) {
        this.setState({subs: res.data.result})
      } else {
        console.log(res.data.error)
        store.addNotif(res.data.error, 'error')
      }
    }).catch(err => {
      if (err.response) {
        console.log(err.response)
        store.addNotif(err.response.data.error, 'error')
      }
    })
  }
  
  componentWillReceiveProps (nextProps) {
    console.log(nextProps)
  }
  

  componentDidMount () {
    console.log(store.movie)
    if (this.video) {
      if (global.localStorage.getItem('volume')) {
        this.video.volume = global.localStorage.getItem('volume')
      }
      this.video.addEventListener('volumechange', (volume) => {
        global.localStorage.setItem('volume', this.video.volume)
      })
      this.video.addEventListener('keypress', this.ChangePlayed)
      this.video.addEventListener('loadstart', (e) => {
        console.log(e)
        console.log(this.video.readyState)
      })
      this.video.addEventListener('durationchange', (e) => {
        console.log(e)
        console.log(this.video.readyState)
      })
      this.video.addEventListener('loadedmetadata', (e) => {
        console.log(e)
        console.log(this.video.readyState)
      })
      this.video.addEventListener('loadeddata', (e) => {
        console.log(e)
        console.log(this.video.readyState)
      })
      this.video.addEventListener('stalled', (e) => {
        console.log(e)
        console.log(this.video.readyState)
      })
      this.video.addEventListener('progress', (e) => {
        console.log(e)
        console.log(this.video.readyState)
        console.log(this.video.buffered)
        if (this.video.buffered.length >= 1) {
          console.log(this.video.buffered.start(0))
          console.log(this.video.buffered.end(0))
        }
      })
      this.video.addEventListener('canplay', (e) => {
        console.log(e)
        console.log(this.video.readyState)
      })
      this.video.addEventListener('canplaythrough', (e) => {
        console.log(this.video.CAN_PLAY_THROUGH)
      })
      // this.video.addEventListener('emptied', (e) => {
      //   console.log(this.video.error)
      //   this.video.currentTime = 0
      //   this.video.load()
      //   store.addNotif('An error occured in this video!', 'error')
      // })
      this.video.addEventListener('error', (err) => {
        console.log(this.video.error)
        this.video.currentTime = 0
        this.video.load()
        store.addNotif('An error occured in this video!', 'error')
      })
    }
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
        <video id='player' ref={(ref) => { this.video = ref }} controls crossOrigin='anonymous' preload='metadata' poster={`https://image.tmdb.org/t/p/w500/${store.movie.backdrop_path}`} >
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
