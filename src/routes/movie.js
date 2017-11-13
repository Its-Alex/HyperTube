import React, { Component } from 'react'
import { Dimmer, Image, Button, Icon, Divider, Accordion, Card } from 'semantic-ui-react'
import { tmdb, local } from '../utils/api.js'
import store from '../utils/store'
import _ from 'lodash'

function QualityBtn (props) {
  return (
    <Button animated
      onClick={props.onClick}
      color={props.color}
      name='submit'
      className='buttonOklm' >
      <Button.Content visible>{props.quality}</Button.Content>
      <Button.Content hidden>
        <Icon name='play' />
      </Button.Content>
    </Button>
  )
}

function getTimming (time) {
  let heure = Math.trunc(time / 60) + 'h' + Math.round(time % 60)
  return heure
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
      background: '',
      timming: '',
      cast: [],
      crew: [],
      activeIndex: 0
    }
    this._isMounted = false
    this.handlePlayMovie = _.debounce(this.handlePlayMovie.bind(this), 1000)
    this.handleShow = this.handleShow.bind(this)
    this.handleHide = this.handleHide.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount () {
    this._isMounted = true
    tmdb().get(`movie/${this.state.movie}`)
    .then((res) => {
      if (res.data.success === false) {
        store.addNotif('Server tmdb offline', 'error')
        if (this._isMounted === true) {
          return this.setState({
            source: null
          })
        }
      }
      if (this._isMounted === true) {
        this.setState({
          title: res.data.title,
          titleOriginal: res.data.original_title,
          description: res.data.overview,
          path_img: `https://image.tmdb.org/t/p/w500${res.data.poster_path}`,
          note: res.data.vote_average,
          background: `https://image.tmdb.org/t/p/w1000${res.data.backdrop_path}`,
          date: res.data.release_date,
          imdbId: res.data.imdb_id,
          id: res.data.id,
          runtime: getTimming(res.data.runtime)
        }, () => { store.addMovie(res.data) })
      }
      tmdb().get(`/movie/${this.state.movie}/credits`).then((res1) => {
        res1.data.cast.forEach(element => {
          if (typeof element.profile_path === 'string') {
            element.profile_path = `https://image.tmdb.org/t/p/w500${element.profile_path}`
          }
        })
        res1.data.crew.forEach(element => {
          if (typeof element.profile_path === 'string') {
            element.profile_path = `https://image.tmdb.org/t/p/w500${element.profile_path}`
          }
        })
        if (this._isMounted === true) {
          this.setState({
            cast: res1.data.cast,
            crew: res1.data.crew
          })
        }
      }).catch(() => {
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
          if (this._isMounted === true) {
            this.setState({
              source: res.data.result
            })
          }
        } else {
          store.addNotif(res.data.error, 'error')
          this.setState({
            source: null
          })
        }
      }).catch((err) => {
        if (err.response) {
          store.addNotif(err.response.data.error, 'error')
          if (this._isMounted === true) {
            this.setState({
              source: null
            })
          }
        } else {
          store.addNotif('Somethings is wrong with our server', 'error')
          if (this._isMounted === true) {
            this.setState({
              source: null
            })
          }
        }
      })
    }).catch((err) => {
      if (err.response) {
        if (err.response.status === 404) {
          store.addNotif('Movie not found', 'error')
          this.props.history.goBack()
        } else {
          store.addNotif(err.response.data.status_message, 'error')
        }
        if (this._isMounted === true) {
          this.setState({
            source: null
          })
        }
      } else {
        store.addNotif('Somethings is wrong with tmdb server', 'error')
        if (this._isMounted === true) {
          this.setState({
            source: null
          })
        }
      }
    })
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  handleClick (e, titleProps) {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    if (this._isMounted === true) this.setState({ activeIndex: newIndex })
  }

  handleShow () { if (this._isMounted === true) this.setState({ active: true }) }
  handleHide () { if (this._isMounted === true) this.setState({ active: false }) }

  handlePlayMovie (uuid) {
    local().post(`/download/${uuid}`).then((res) => {
      if (res.data.success === true) {
        if (res.data.info === 'downloading' || res.data.info === 'downloaded' || res.data.info === 'transcoding') {
          this.props.history.push(`/play/${uuid}/${this.state.id}`)
        } else {
          store.addNotif(`Can't play this movie`, 'error')
        }
      } else {
        store.addNotif(res.data.error, 'error')
      }
    }).catch((err) => {
      if (err.response) {
        store.addNotif(err.response.data.error, 'error')
      }
    })
  }

  render () {
    const { active } = this.state
    const content = (
      <div className='movieBlock'>
        <Button label={this.state.runtime} icon='time' labelPosition='left' />
      </div>
    )
    const { activeIndex } = this.state
    return (
      <div className='backMovie'>
        <h1>{this.state.title}</h1>
        <h5 className='movieDateTime'>{this.state.date}</h5>
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
        <Accordion fluid styled>
          <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
            <Divider horizontal>
              <Icon name='dropdown' />
                DETAIL
              </Divider>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <div className='detail'>
              {this.state.cast ? this.state.cast.map((result, index) => {
                if (result.profile_path) {
                  return (
                    <div key={index} className='card-container'>
                      <Card className='detailCard' style={{backgroundImage: `url('${result.profile_path}')`}} >
                        <div className='opacitavy'>
                          <div className='myCard'>
                            <Card.Content>
                              <Card.Header className='cardName'>
                                {result.name}
                              </Card.Header>
                              <p className='char'>{result.character}</p>
                            </Card.Content>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )
                } else {
                  return (
                    <div key={index} className='card-container'>
                      <Card className='detailCard' style={{backgroundImage: 'url(https://museum.wales/media/40374/empty-profile-grey.jpg)'}} >
                        <div className='opacitavy'>
                          <div className='myCard'>
                            <Card.Content>
                              <Card.Header className='cardName'>
                                {result.name}
                              </Card.Header>
                              <p className='char'>{result.character}</p>
                            </Card.Content>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )
                }
              })
              : (
                null
              )}
            </div>
          </Accordion.Content>
          <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
            <Divider horizontal>
              <Icon name='dropdown' />
                PRODUCTION
              </Divider>
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            <div className='detail'>
              {this.state.crew ? this.state.crew.map((result, index) => {
                if (result.profile_path) {
                  return (
                    <div key={index} className='card-container'>
                      <Card className='detailCard' style={{backgroundImage: `url('${result.profile_path}')`}} >
                        <div className='opacitavy'>
                          <div className='myCard'>
                            <Card.Content>
                              <Card.Header className='cardName'>
                                {result.name}
                              </Card.Header>
                              <p className='job'>{result.job}</p>
                            </Card.Content>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )
                } else {
                  return (
                    <div key={index} className='card-container'>
                      <Card className='detailCard' style={{backgroundImage: 'url(https://museum.wales/media/40374/empty-profile-grey.jpg)'}} >
                        <div className='opacitavy'>
                          <div className='myCard'>
                            <Card.Content>
                              <Card.Header className='cardName'>
                                {result.name}
                              </Card.Header>
                              <p className='job'>{result.job}</p>
                            </Card.Content>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )
                }
              })
              : (
                null
              )}
            </div>
          </Accordion.Content>
        </Accordion>
        <Divider horizontal>Select quality to play</Divider>
        <div className='quality'>
          { this.state.source !== null && this.state.source.length !== 0
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
                  return <QualityBtn key={index} name='submit' uuid={res.uuid} quality={res.quality} color={color} onClick={() => {
                    store.addNotif(`This video can't be played`, 'error')
                  }} />
                } else {
                  color = 'grey'
                }
                return <QualityBtn key={index} name='submit' uuid={res.uuid} quality={res.quality} color={color} onClick={this.handlePlayMovie.bind(this, res.uuid)} />
              } else {
                return null
              }
            })
          : (this.state.source !== null)
          ? <div className='loader'>
            <div className='blob blob-0' />
            <div className='blob blob-1' />
            <div className='blob blob-2' />
            <div className='blob blob-3' />
            <div className='blob blob-4' />
            <div className='blob blob-5' />
          </div> : null}
        </div>
      </div>
    )
  }
}

export default Movie
