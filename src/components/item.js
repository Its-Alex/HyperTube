import React, { Component } from 'react'
// import { Item, Label } from 'semantic-ui-react'
import '../scss/item.css'

class Item extends Component {
  constructor (props) {
    super(props)
    this.state = {
      result: []
    }
  }

  componentWillMount () {
    this.setState({
      result: this.props.result
    })
  }

  render () {
    return (
      <div>
        <div className='container'>
          <div className='imgcontent'>
            <img src='https://www.ecranlarge.com/uploads/image/000/963/full-metal-jacket-affiche-963183.jpg' alt='Girl in a jacket' />
          </div>
          <div className='description'>
            <div className='titre'>
              {this.state.results.original_title}
            </div>
            <div className='resumer'>
              {this.state.results.overview}
            </div>
            <div className='noteEtLangue'>
              <div className='note'>
                {this.state.results.vote_average}
              </div>
              <div className='langue'>
                {this.state.results.original_language}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Item
