import React, { Component } from 'react'
import { Menu, Input, Responsive, Dropdown } from 'semantic-ui-react'
import { tmdb, local } from '../utils/api'
import store from '../utils/store.js'
import { observer } from 'mobx-react'

@observer

class FrontBarre extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeItem: this.props.history,
      search: ''
    }
    this.handleItemClick = this.handleItemClick.bind(this)
    this.handleChangeSearch = this.handleChangeSearch.bind(this)
    this.handleKeySearch = this.handleKeySearch.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
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
        console.log(err.response)
        store.addNotif(err.response.data.error, 'error')
      }
    })
  }

  handleItemClick (e, { name }) {
    this.setState({
      activeItem: name
    })
    this.props.history.push(`/${name}`)
  }

  handleChangeSearch (event) {
    this.setState({
      search: event.target.value
    })
  }

  handleKeySearch (event) {
    if (typeof event.target.value === 'string' && event.target.value !== '' && event.key === 'Enter') {
      tmdb().get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: '4add767f00472cadffc84346bd8572e6',
          page: store.pageSearchResult,
          query: event.target.value
        }
      }).then((res) => {
        console.log(res)
        store.setTotalPages(res.data.total_pages)
        store.resetSearch(res.data.results)
      }).catch((err) => {
        console.log(err)
      })
      this.props.history.push(`/search/${event.target.value}`)
      event.target.value = ''
    }
  }

  render () {
    const { activeItem } = this.state
    return (
      <div id='header'>
        <Responsive as={Menu} maxWidth={768} >
          <Dropdown icon='content' fluid selection>
            <Dropdown.Menu>
              <Menu.Item name='popular' active={activeItem === 'popular'} onClick={this.handleItemClick} />
              <Menu.Item name='top_rated' active={activeItem === 'top_rated'} onClick={this.handleItemClick} />
              <Menu.Item name='profile' active={activeItem === 'profile'} onClick={this.handleItemClick} />
              <Menu.Item name='test' active={activeItem === 'test'} onClick={this.handleItemClick} />
              <Menu.Item>
                <Input icon='search' placeholder='Search...' value={this.state.search} onChange={this.handleChangeSearch} onKeyPress={this.handleKeySearch} />
              </Menu.Item>
              <Menu.Item name='logout' onClick={() => this.handleDisconnect()} />
            </Dropdown.Menu>
          </Dropdown>
        </Responsive>
        <Responsive as={Menu} minWidth={769}>
          <Menu.Item name='popular' active={activeItem === 'popular'} onClick={this.handleItemClick} />
          <Menu.Item name='top_rated' active={activeItem === 'top_rated'} onClick={this.handleItemClick} />
          <Menu.Item name='profile' active={activeItem === 'profile'} onClick={this.handleItemClick} />
          <Menu.Item name='test' active={activeItem === 'test'} onClick={this.handleItemClick} />
          <Menu.Menu position='right'>
            <Menu.Item>
              <Input icon='search' placeholder='Search...' value={this.state.search} onChange={this.handleChangeSearch} onKeyPress={this.handleKeySearch} />
            </Menu.Item>
            <Menu.Item name='logout' onClick={() => this.handleDisconnect()} />
          </Menu.Menu>
        </Responsive>
      </div>
    )
  }
}

export default FrontBarre
