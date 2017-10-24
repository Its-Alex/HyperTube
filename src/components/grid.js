import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import Item from './item.js'

class Grid extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <InfiniteScroll
          pageStart={1}
          loadMore={this.props.handleChangePage}
          hasMore={this.props.hasMore}
          loader={<div className='loader'>Loading ...</div>}
        ><div className='grid'>{
            this.props.result ? (this.props.result.map((res, index) => {
              return (<Item res={res} key={index} />)
            })
            ) : (
              null
            )
          }</div>
          }
        </InfiniteScroll>
      </div>
    )
  }
}

export default Grid
