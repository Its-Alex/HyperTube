import React, { Component } from 'react'
import { Menu, Input } from 'semantic-ui-react'
import '../scss/frontBarre.scss'

class FrontBarre extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeItem: 'accueil',
      search: ''
    }
    this.changeUrl = this.changeUrl.bind(this)
    this.handleChangeSearch = this.handleChangeSearch.bind(this)
    this.handleKeySearch = this.handleKeySearch.bind(this)
  }
  changeUrl (e, { name }) {
    this.props.history.push('/' + name)
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
            name='news'
            active={activeItem === 'nouveautés'}
            content='Nouveautés'
            onClick={this.changeUrl}
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
