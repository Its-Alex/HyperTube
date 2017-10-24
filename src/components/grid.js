import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import Item from './item.js'

import '../scss/components/grid.css'

class Grid extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <InfiniteScroll
        pageStart={1}
        loadMore={this.props.handleChangePage}
        hasMore={this.props.hasMore}
        loader={<div className='loader'>Loading ...</div>}>
        <div className='grid'>
          { this.props.result
            ? this.props.result.map((res, index) => {
              return (
                <Item key={index}
                  poster={'https://image.tmdb.org/t/p/w500/' + res.poster_path}
                  title={res.original_title}
                  desc={res.overview}
                  date={res.release_date}
                  grade={res.vote_average} />
              )
            }) : null}
        </div>
        }
      </InfiniteScroll>
    )
  }
}

export default Grid
