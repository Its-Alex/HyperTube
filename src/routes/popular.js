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

  componentWillMount () {
    axios.get(`https://api.themoviedb.org/3/movie/popular`, {
      params: {
        api_key: '4add767f00472cadffc84346bd8572e6',
        page: this.state.page,
        language: 'fr'
      }
    }).then((res) => {
      this.setState({
        page: res.data.page,
        result: res.data.results,
        nbPage: res.data.total_pages
      })
      console.log(res.data.total_pages)
      console.log(`total pages --> ${res.data.total_pages}`)
    }).catch((err) => {
      console.log(err)
    })
  }
  handleChangePage () {
    if (this.state.page < 10) {
      axios.get(`https://api.themoviedb.org/3/movie/popular`, {
        params: {
          api_key: '4add767f00472cadffc84346bd8572e6',
          page: this.state.page,
          language: 'fr'
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
      let page = parseInt(this.state.page, 10) + 1
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

export default Accueil
