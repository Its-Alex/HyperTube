import React, { Component } from 'react'
import '../scss/components/item.css'

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
      <div className='item-container'>
        <img className='cover' src={this.props.poster} alt={this.props.title} />
        <div className='item-info'>
          <div className='title'>
            {this.props.title}
          </div>
          <div className='date'>
            {this.props.date}
          </div>
          <div className='desc'>
            {this.props.desc}
          </div>
          <div className='grade'>
            {this.props.grade}
          </div>
        </div>
      </div>
    )
  }
}

export default Item
