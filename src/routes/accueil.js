import React, { Component } from 'react'
import FrontBarre from '../components/frontbarre.js'

class Accueil extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  render () {
    return (
      <div>
        <FrontBarre />
      </div>
    )
  }
}

export default Accueil
