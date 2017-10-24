import React, { Component } from 'react'
// import { Item, Label } from 'semantic-ui-react'
import { Button } from 'semantic-ui-react'
import '../scss/item.css'

const style = {
  margin: 3,
  height: 29
}

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
      <div className='container'>
        <div className='imgcontent'>
          <img id='path_img' src={'https://image.tmdb.org/t/p/w500/' + this.props.res.poster_path} alt={this.props.res.original_title} />
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
              <Button style={style}>
                Show
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Item
