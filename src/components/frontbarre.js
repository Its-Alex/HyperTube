import React, { Component } from 'react'
import { Menu, Input } from 'semantic-ui-react'
import '../scss/frontbarre.scss'

import Description from './descirption'

class FrontBarre extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeItem: '',
      search: ''
    }
    this.handleItemClick = this.handleItemClick.bind(this)
    this.handleChangeSearch = this.handleChangeSearch.bind(this)
    this.handleKeySearch = this.handleKeySearch.bind(this)
  }
  handleItemClick (e, { name }) {
    this.setState({
      activeItem: name
    })
  }
  handleChangeSearch (event) {
    this.setState({
      search: event.target.value
    })
  }
  handleKeySearch (event) {
    if (this.state.search !== '' && event.key === 'Enter') {
      console.log('faire la requet axios')
      // REQUET AXIOS
      this.setState({search: ''})
    }
  }
  render () {
    const { activeItem } = this.state
    return (
      <div>
        <Menu>
          <Menu.Item
            name='accueil'
            active={activeItem === 'accueil'}
            content='Accueil'
            onClick={this.handleItemClick}
          />

          <Menu.Item
            name='nouveautés'
            active={activeItem === 'nouveautés'}
            content='Nouveautés'
            onClick={this.handleItemClick}
          />

          <Menu.Item
            name='a_voir'
            active={activeItem === 'a_voir'}
            content='A voir'
            onClick={this.handleItemClick}
          />
          <Menu.Menu position='right'>
            <Menu.Item>
              <Input icon='search' placeholder='Search...' value={this.state.search} onChange={this.handleChangeSearch} onKeyPress={this.handleKeySearch} />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Description />
      </div>
    )
  }
}

export default FrontBarre
