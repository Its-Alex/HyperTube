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
            onClick={this.changeUrl}
          />
          <Menu.Item

            name='top_rated'
            active={activeItem === 'top_rated'}
            content='Top Rated'
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
      </div>
    )
  }
}

export default FrontBarre
