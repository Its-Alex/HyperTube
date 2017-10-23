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
              {this.props.res.original_title}
            </div>
            <div className='resumer'>
              {this.props.res.overview}
            </div>
            <div className='noteEtLangue'>
              <div className='note'>
                {this.props.res.vote_average}
              </div>
              <div className='langue'>
                {this.props.res.original_language}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Item
