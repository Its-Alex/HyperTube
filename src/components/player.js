import React, { Component } from 'react'

class Player extends Component {
  constructor (props) {
    super(props)

    this.state = {
      played: false
    }
    this.ChangePlayed = this.ChangePlayed.bind(this)
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
        <video ref={(ref) => { this.video = ref }} autoPlay controls crossOrigin='anonymous' poster={this.props.post} >
          <source src={this.props.src} />
        </video>
      </div>
    )
  }
}

export default Player
