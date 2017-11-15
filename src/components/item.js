import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Rating, Icon, Statistic, Segment, Button } from 'semantic-ui-react'

@observer
class Item extends Component {
  constructor (props) {
    super(props)
    this.state = {
      poster: ''
    } 
}

  statRating () {
    return (
      <Statistic>
        <Statistic.Value className='statValue'>
          <Icon name='star' />
          {this.props.grade}
        </Statistic.Value>
        <Statistic.Label>
          <Rating maxRating={10} defaultRating={this.props.grade} icon='star' size='huge' disabled />
        </Statistic.Label>
      </Statistic>
    )
  }

  handleMovie (id) {
    this.props.history.push(`/movie/${id}`)
  }

  render () {
    return (
      <div className='item-container' style={{backgroundImage: 'url(' + this.props.poster + ')'}}>
        <div className='opac'>
          <div className='item-info'>
            <div className='title'>
              {this.props.title}
              <div className='date'>
                {this.props.date}
              </div>
            </div>
            <Segment inverted>
              <Button inverted color='green' onClick={() => this.handleMovie(this.props.id)} >See More</Button>
              {this.props.viewed === true
              ? <p>Viewed</p>
              : null}
            </Segment>
            <div className='grade'>
              <hr />
              {this.statRating()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Item
