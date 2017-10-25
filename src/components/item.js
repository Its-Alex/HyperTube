import React, { Component } from 'react'
import '../scss/components/item.css'
import { Rating, Icon, Statistic } from 'semantic-ui-react'

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

  statRating () {
    return (
      <Statistic>
        <Statistic.Value className='statValue'>
          <Icon name='star' />
          {this.props.grade}
        </Statistic.Value>
        <Statistic.Label>
          <Rating maxRating={10} defaultRating={this.props.grade} icon='star' size='huge' />
        </Statistic.Label>
      </Statistic>
    )
  }

  render () {
    return (
      <div className='item-container' style={{backgroundImage: 'url(' + this.props.poster + ')'}}>
        <div className='item-info'>
          <div className='title'>
            {this.props.title}
          </div>
          <div className='date'>
            {this.props.date}
          </div>
          <div className='grade'>
            <hr />
            {this.statRating()}
          </div>
        </div>
      </div>
    )
  }
}

export default Item
