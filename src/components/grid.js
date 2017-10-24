import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import Item from './item.js'

class Grid extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentWillMount () {

  }

  render () {
    return (
      <div>
        <InfiniteScroll
          pageStart={1}
          loadMore={this.handleChangePage}
          hasMore={this.state.hasMore}
          loader={<div className='loader'>Loading ...</div>}
        ><div className='grid'>{
            this.state.result ? (this.state.result.map((res) => {
              return (<Item res={res} key={Math.random()} />)
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
