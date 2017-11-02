import React, { Component } from 'react'
import { Header, Dimmer, Image, Button, Icon } from 'semantic-ui-react'
import '../scss/movie.css'
import { tmdb, local } from '../utils/api.js'

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
      imdbId: ''
    }
    this.handlePlayMovie = this.handlePlayMovie.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleHide = this.handleHide.bind(this)
  }

  handleShow () { this.setState({ active: true }) }
  handleHide () { this.setState({ active: false }) }

  //  TEST --->  http://localhost:3000/movie/346364
  handlePlayMovie (received) {
    local().post(`/download/${received}`).then((res) => {
      console.log(res)
      if (res.data.success === true) {
        console.log('success')
      } else {
        console.log('erreur')
      }
    }).catch((err2) => {
      console.log(err2)
    })
    // this.setState({
    //   language: received
    // }, () => {
    //   console.log(`film ---> ${this.state.title}`)
    //   console.log(`id film ---> ${this.state.movie}`)
    //   console.log(`titre_original --> ${this.state.titleOriginal}`)
    //   console.log(`langue selectionner --> ${this.state.language}`)
    //   console.log(`imdbId --- > ${this.state.imdbId}`)
    //   console.log('start')
    // })
  }

  componentWillMount () {
    tmdb().get(`movie/${this.state.movie}`, {
      params: {
        language: 'fr'
      }
    }).then((res) => {
      this.setState({
        title: res.data.title,
        titleOriginal: res.data.original_title,
        description: res.data.overview,
        path_img: `https://image.tmdb.org/t/p/w500/${res.data.poster_path}`,
        note: res.data.vote_average,
        date: res.data.release_date,
        imdbId: res.data.imdb_id
      })
      local().get('/search', {
        params: {
          imdbId: res.data.imdb_id,
          tmdbId: res.data.id,
          type: 'movies',
          title: encodeURI(res.data.original_title)
        }
      }).then((res1) => {
        console.log(res1)
        if (res1.data.success === true) {
          this.setState({
            source: res1.data.result
          })
        }
      }).catch((err1) => {
        console.log(err1)
      })
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  render () {
    const { active } = this.state
    const content = (
      <div className='movieBlock'>
        <Header as='h2' inverted>
          {this.state.title}
        </Header>
        <Header as='h4' inverted>
          {this.state.description}
        </Header>

        {this.state.source.map((res, index) => {
          if (res !== null) {
            if (res.state === 'ready') {
              return (
                <Button animated
                  key={index}
                  onClick={() => { this.handlePlayMovie(res.uuid) }}
                  color={'green'}
                  >
                  <Button.Content visible>{res.quality}</Button.Content>
                  <Button.Content hidden>
                    <Icon name='play' />
                  </Button.Content>
                </Button>
              )
            } else if (res.state === 'downloading') {
              return (
                <Button animated
                  key={index}
                  onClick={() => { this.handlePlayMovie(res.uuid) }}
                  color={'orange'}
                  >
                  <Button.Content visible>{res.quality}</Button.Content>
                  <Button.Content hidden>
                    <Icon name='play' />
                  </Button.Content>
                </Button>
              )
            } else {
              return (
                <Button animated
                  key={index}
                  onClick={() => { this.handlePlayMovie(res.uuid) }}
                  >
                  <Button.Content visible>{res.quality}</Button.Content>
                  <Button.Content hidden>
                    <Icon name='play' />
                  </Button.Content>
                </Button>
              )
            }
          }
        })
        }
      </div>
    )
    return (
      <div className='backMovie'>
        <Dimmer.Dimmable
          as={Image}
          dimmed={active}
          dimmer={{ active, content }}
          onMouseEnter={this.handleShow}
          onMouseLeave={this.handleHide}
          size='large'
          src={this.state.path_img}
        />
      </div>
    )
  }
}

export default Movie
