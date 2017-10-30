import React, { Component } from 'react'
import { Menu, Input, Icon } from 'semantic-ui-react'
import '../scss/components/frontBarre.css'
import axios from 'axios'
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
    global.localStorage.removeItem('token')
    this.props.history.push('/login')
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
      axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: '4add767f00472cadffc84346bd8572e6',
          page: 1,
          query: event.target.value
        }
      }).then((res) => {
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
      <div>
        <Menu stackable
          style={{borderRadius: '0px'}} >
          <Menu.Item
            name='popular'
            active={activeItem === 'popular'}
            content='Popular'
            onClick={this.handleItemClick}
          />
          <Menu.Item

            name='top_rated'
            active={activeItem === 'top_rated'}
            content='Top Rated'
            onClick={this.handleItemClick}
          />

          <Menu.Item
            name='profile'
            active={activeItem === 'profile'}
            content='Profile'
            onClick={this.handleItemClick}
          />

          <Menu.Item
            name='test'
            active={activeItem === 'test'}
            content='test'
            onClick={this.handleItemClick}
          />

          <Menu.Menu position='right'>
          {global.localStorage.getItem('token') ? (
            <Menu.Item
              id='disconnect'
              onClick={() => this.handleDisconnect()}
            >
              <Icon  name='shutdown'/>
            </Menu.Item>
          ) : (
            null
          )
          }
            <Menu.Item>
              <Input icon='search' placeholder='Search...' value={this.state.search} onChange={this.handleChangeSearch} onKeyPress={this.handleKeySearch} />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    )
  }
}

export default FrontBarre
