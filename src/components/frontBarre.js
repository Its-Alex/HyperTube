import React, { Component } from 'react'
import { Menu, Input } from 'semantic-ui-react'
import '../scss/components/frontBarre.css'

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
    if (this.state.search !== '' && event.key === 'Enter') {
      this.props.history.push(`/search/${this.state.search}`)
      this.setState({search: ''})
    }
  }
  render () {
    const { activeItem } = this.state
    return (
      <div>
        <Menu stackable>
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

          {/* <Menu.Item
            name='test'
            active={activeItem === 'test'}
            content='test'
            onClick={this.handleItemClick}
          /> */}

          <Menu.Menu position='right'>
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
