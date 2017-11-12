import React, { Component } from 'react'
import { Menu, Input } from 'semantic-ui-react'
import { tmdb, local } from '../utils/api'
import store from '../utils/store.js'
import { observer } from 'mobx-react'

@observer
class FrontBarre extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeItem: this.props.history,
      search: '',
      alreadyView: []      
    }
    this.handleItemClick = this.handleItemClick.bind(this)
    this.handleChangeSearch = this.handleChangeSearch.bind(this)
    this.handleKeySearch = this.handleKeySearch.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
    this.handleAlreadyViewed = this.handleAlreadyViewed.bind(this)
  }

  handleDisconnect () {
    local().delete('/user/logout').then(res => {
      if (res.data.success === true) {
        global.localStorage.removeItem('token')
        this.props.history.push('/login')
      } else {
        store.addNotif('There is an error!', 'error')
      }
    }).catch(err => {
      if (err.response) {
        store.addNotif(err.response.data.error, 'error')
      }
    })
  }

  handleAlreadyViewed () {
    local().get('/view').then((res) => {
      if (res.data.success === true) {
       store.addAlreadyView(res.data.result)
      }
    }).catch((err) => {
       console.log(err.response)
    })
  }
  
  componentWillUnmount () {
    store.ResetAlreadyView()
  }
  

  handleItemClick (e, { name }) {
    this.setState({ activeItem: name })
    this.props.history.push(`/${name}`)
  }

  handleChangeSearch (event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleKeySearch (event) {
    if (typeof event.target.value === 'string' && event.target.value !== '' && event.key === 'Enter') {
      this.handleAlreadyViewed()
      tmdb().get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: '4add767f00472cadffc84346bd8572e6',
          page: 1,
          query: this.state.search
        }
      }).then((res) => {
        console.log(res)
        res.data.results = res.data.results.map((element) => {
          if (store.alreadyView.indexOf(element.id) !== -1) {
            element.isViewed = true
          } else {
            element.isViewed = false
          }
          return element
        }, this)
        store.resetSearch(res.data)
        this.setState({ search: '' })
      }).catch((err) => {
      })
      this.props.history.push(`/search/${event.target.value}`)
      event.target.value = ''
    }
  }
  
  render () {
    const { activeItem } = this.state
    return (
      <div id='header'>
        <Menu stackable>
          <Menu.Item name='popular' active={activeItem === 'popular'} onClick={this.handleItemClick} />
          <Menu.Item name='top_rated' active={activeItem === 'top_rated'} onClick={this.handleItemClick} />
          <Menu.Item name='profile' active={activeItem === 'profile'} onClick={this.handleItemClick} />
          <Menu.Menu position='right'>
            <Menu.Item>
              <Input icon='search' name='search' placeholder='Search...' value={this.state.search} onChange={this.handleChangeSearch} onKeyPress={this.handleKeySearch} />
            </Menu.Item>
            <Menu.Item name='logout' onClick={() => this.handleDisconnect()} />
          </Menu.Menu>
        </Menu>
      </div>
    )
  }
}

export default FrontBarre
