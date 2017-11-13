import React, { Component } from 'react'
import { Menu, Input } from 'semantic-ui-react'
import { local } from '../utils/api'
import store from '../utils/store.js'
import { observer } from 'mobx-react'

@observer
class FrontBarre extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeItem: this.props.history,
      search: '',
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
        store.addNotif(err.response.data.error, 'error')
      }
    })
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
      this.props.history.push(`/search/${event.target.value}`)
      this.setState({search: ''})
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
