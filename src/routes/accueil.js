import React, { Component } from 'react'
import Item from '../components/item.js'

class Accueil extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  render () {
    return (
      <div>
        <Item />
      </div>
    )
  }
}

export default Accueil
