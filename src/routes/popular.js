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
      hasMore: true
    }
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  componentWillMount () {
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=4add767f00472cadffc84346bd8572e6&page=${this.state.page}`).then((res) => {
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
    if (this.state.page < 10) {
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
            loadMore={this.handleChangePage}
            hasMore={false}
            loader={<div className='loader'>Loading ...</div>}
          >{
              this.state.result ? (this.state.result.map((res) => {
                return (<Item res={res} />)
              })
              ) : (
                null
              )
            }
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

export default Accueil
