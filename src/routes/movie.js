import React, { Component } from 'react'
import { Header, Dimmer, Image, Button, Icon, Label } from 'semantic-ui-react'
import axios from 'axios'
import '../scss/movie.css'

class Movie extends Component {
  constructor (props) {
    super(props)
    this.state = {
      movie: this.props.match.params.id,
      language: '',
      title: '',
      description: '',
      langue: [],
      path_img: '',
      note: '',
      date: ''
    }
    this.handlePlayMovie = this.handlePlayMovie.bind(this)
  }

  handleShow () { this.setState({ active: true }) }
  handleHide () { this.setState({ active: false }) }

  //  TEST --->  http://localhost:3000/movie/346364
  handlePlayMovie (received) {
    this.setState({
      language: received
    }, () => {
      console.log(`film ---> ${this.state.title}`)
      console.log(`id film ---> ${this.state.movie}`)
      console.log(`titre_original --> ${this.state.titleOriginal}`)
      console.log(`langue selectionner --> ${this.state.language}`)
      console.log('start')
    })
  }

  componentWillMount () {
    axios.get(`https://api.themoviedb.org/3/movie/${this.state.movie}`, {
      params: {
        api_key: '4add767f00472cadffc84346bd8572e6',
        language: 'fr'
      }
    }).then((res) => {
      this.setState({
        title: res.data.title,
        titleOriginal: res.data.original_title,
        description: res.data.overview,
        langue: res.data.spoken_languages,
        language: res.data.original_language,
        nbLangue: res.data.spoken_languages.length,
        path_img: `https://image.tmdb.org/t/p/w500/${res.data.poster_path}`,
        note: res.data.vote_average,
        date: res.data.release_date
      })
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

        {this.state.langue.map((res, index) => {
          return (
            <Button animated
              key={index}
              onClick={() => { this.handlePlayMovie(res.iso_639_1) }}
              >
              <Button.Content visible>{res.name}</Button.Content>
              <Button.Content hidden>
                <Icon name='play' />
              </Button.Content>
            </Button>
          )
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
