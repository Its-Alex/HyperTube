import React, { Component } from 'react'
import { Header, Dimmer, Image, Button, Icon, Divider } from 'semantic-ui-react'
import { tmdb, local } from '../utils/api.js'
import store from '../utils/store'

function QualityBtn (props) {
  return (
    <Button animated
      onClick={props.onClick}
      color={props.color} >
      <Button.Content visible>{props.quality}</Button.Content>
      <Button.Content hidden>
        <Icon name='play' />
      </Button.Content>
    </Button>
  )
}

class Movie extends Component {
  constructor (props) {
    super(props)
    this.state = {
      movie: this.props.match.params.id,
      language: '',
      title: '',
      description: '',
      source: [],
      path_img: '',
      note: '',
      date: '',
      imdbId: '',
      background: ''
    }
    this.handlePlayMovie = this.handlePlayMovie.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleHide = this.handleHide.bind(this)
  }

  handleShow () { this.setState({ active: true }) }
  handleHide () { this.setState({ active: false }) }

  handlePlayMovie (received) {
    local().post(`/download/${received}`).then((res) => {
      if (res.data.success !== false) {
        this.props.history.push(`/play/${received}`)
      } else {
        store.addNotif(res.data.error, 'error')
      }
    }).catch((err) => {
      if (err.response) {
        console.log(err.response)
        store.addNotif(err.response.data.error, 'error')
      }
    })
  }

  componentWillMount () {
    tmdb().get(`movie/${this.state.movie}`)
    .then((res) => {
      console.log(res)
      this.setState({
        title: res.data.title,
        titleOriginal: res.data.original_title,
        description: res.data.overview,
        path_img: `https://image.tmdb.org/t/p/w500/${res.data.poster_path}`,
        note: res.data.vote_average,
        background: `https://image.tmdb.org/t/p/w1000/${res.data.backdrop_path}`,
        date: res.data.release_date,
        imdbId: res.data.imdb_id
      })
      local().get('/search', {
        params: {
          imdbId: res.data.imdb_id,
          tmdbId: res.data.id,
          type: 'movies',
          title: res.data.original_title
        }
      }).then((res) => {
        if (res.data.success === true) {
          this.setState({
            source: res.data.result
          })
        } else {
          store.addNotif(res.data.error, 'error')
        }
      }).catch((err) => {
        if (err.response) {
          console.log(err.response)
          store.addNotif(err.response.data.error, 'error')
        }
      })
    }).catch((err) => {
      if (err.response) {
        console.log(err.response)
        store.addNotif(err.response.data.error, 'error')
      }
    })
  }

  render () {
    const { active } = this.state
    const content = (
      <div className='movieBlock'>
        <Header as='h2' inverted>
          {this.state.title}
        </Header>
      </div>
    )
    return (
      <div className='backMovie'>
        <h1>{this.state.title}</h1>
        <Dimmer.Dimmable
          as={Image}
          dimmed={active}
          dimmer={{ active, content }}
          onMouseEnter={this.handleShow}
          onMouseLeave={this.handleHide}
          size='large'
          src={this.state.background}
        />
        <Divider horizontal>overview</Divider>
        <div className='overview'>
          {this.state.description}
        </div>
        <Divider horizontal>Select quality to play</Divider>
        <div className='quality'>
          { this.state.source.length !== 0
          ? this.state.source.map((res, index) => {
            if (res !== null) {
              let color
              if (res.state === 'ready') {
                color = 'green'
              } else if (res.state === 'downloading') {
                color = 'orange'
              } else if (res.state === 'transcoding') {
                color = 'brown'
              } else if (res.state === 'error') {
                color = 'red'
              } else {
                color = 'grey'
              }
              return <QualityBtn key={index} uuid={res.uuid} quality={res.quality} color={color} onClick={this.handlePlayMovie.bind(this, res.uuid)} />
            } else {
              return null
            }
          })
          : <div className='loader'>
            <div className='blob blob-0' />
            <div className='blob blob-1' />
            <div className='blob blob-2' />
            <div className='blob blob-3' />
            <div className='blob blob-4' />
            <div className='blob blob-5' />
          </div>}
        </div>
      </div>
    )
  }
}

export default Movie
