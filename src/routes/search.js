import React, { Component } from 'react'
import { tmdb } from '../utils/api.js'
import Grid from '../components/grid'
import store from '../utils/store.js'
import { observer } from 'mobx-react'

@observer

class Search extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: store.pageSearchResult,
      hasMore: true,
    }
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  handleChangePage () {
    if (store.totalPages > 1 && store.totalPages < 1000) {
      tmdb().get(`search/movie`, {
        params: {
          page: store.pageSearchResult,
          query: this.props.match.params.id
        }
      }).then((res) => {
        store.addResultSearch(res.data.results)
        if (this.state.page <= res.data.total_pages) return this.setState({
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
