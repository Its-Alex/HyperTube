import React, { Component } from 'react'
// import { Item, Label } from 'semantic-ui-react'
import '../scss/item.css'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroller'

class Item extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      result: [],
      hasMore: true
    }
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  componentWillMount () {
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=4add767f00472cadffc84346bd8572e6&page=${this.state.page}`).then((res) => {
      // console.log(res)
      this.setState({
        page: res.data.page,
        result: res.data.results
      })
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }
  handleChangePage () {
    if (this.state.page < 1000) {
      axios.get(`https://api.themoviedb.org/3/movie/popular`, {
        params: {
          api_key: '4add767f00472cadffc84346bd8572e6',
          page: this.state.page
        }
      }).then((res) => {
        this.setState({
          page: res.data.page,
          result: res.data.results
        })
        console.log(res.data)
      }).catch((err) => {
        console.log(err)
      })
      let page = this.state.page + 1
      this.setState({
        page: page
      })
    } else {
      this.setState({
        hasMore: false
      })
    }
  }

  render () {
    return (
      <div>
        <div className='bodytest'>
          <InfiniteScroll
            pageStart={1}
            loadMore={this.handleChangePage()}
            hasMore={this.state.hasMore}
            loader={<div className='loader'>Loading ...</div>}
          >{
            this.state.results ? (
              this.state.results.map(
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
            )
          ) : (
            null
          )
        }</InfiniteScroll>


        </div>
      </div>
    )
  }
}

export default Item
