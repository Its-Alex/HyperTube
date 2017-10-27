import React, { Component } from 'react'
import axios from 'axios'
import Grid from '../components/grid'
import store from '../utils/store.js'
import { observer } from 'mobx-react'

@observer

class Search extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 2,
      hasMore: true,
    }
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  handleChangePage () {
    if (store.totalPages > 1 && store.totalPages < 1000) {
      axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: '4add767f00472cadffc84346bd8572e6',
          page: this.state.page,
          query: this.props.match.params.id
        }
      }).then((res) => {
        store.addResultSearch(res.data.results)
        if (this.state.page <= res.data.total_pages) return this.setState({
          page: this.state.page + 1,
          hasMore: this.state.page !== res.data.total_pages ? true : false
        })
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  render () {
    return (
      <div>
        <Grid handleChangePage={this.handleChangePage} hasMore={this.state.hasMore} result={store.searchResult} history={this.props.history} />
      </div>
    )
  }
}

export default Search
