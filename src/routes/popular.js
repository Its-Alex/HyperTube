import React, { Component } from 'react'
import Item from '../components/item.js'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroller'
import '../scss/item.css'

class Accueil extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      result: [],
      hasMore: true,
      nbPage: ''
    }
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  handleChangePage () {
    axios.get(`https://api.themoviedb.org/3/movie/popular`, {
      params: {
        api_key: '4add767f00472cadffc84346bd8572e6',
        page: this.state.page,
        language: 'fr'
      }
    }).then((res) => {
      if (this.state.page === res.data.total_pages) this.setState({hasMore: false})
      this.setState({
        page: this.state.page + 1,
        result: this.state.result.concat(res.data.results)
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  render () {
    return (
      <div>
        <InfiniteScroll
          pageStart={1}
          loadMore={this.handleChangePage}
          hasMore={this.state.hasMore}
          loader={<div className='loader'>Loading ...</div>}>
          <div className='grid'>
            { this.state.result
              ? this.state.result.map((res, index) => {
                return (
                  <Item res={res} key={index} />
                )
              }) : null
            }
          </div>
        </InfiniteScroll>
      </div>
    )
  }
}

export default Accueil
