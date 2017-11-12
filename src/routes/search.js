import React, { Component } from 'react'
import { tmdb, local } from '../utils/api.js'
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

  
  componentWillMount () {
    if (this.props.history !== undefined) {
    store.resetSearchRefresh()
      local().get('/view').then((res) => {
        if (res.data.success === true) {
        store.addAlreadyView(res.data.result)
        }
      }).catch((err) => {
        console.log(err.response)
      })
    }
  }
  
  handleChangePage () {
    if ((store.totalPages >= 1 && store.totalPages < 1000 && store.pageSearchResult <= store.totalPages) || (store.refresh === true)) {
      tmdb().get(`search/movie`, {
        params: {
          page: store.pageSearchResult,
          query: this.props.match.params.id
        }
      }).then((res) => {
        res.data.results = res.data.results.map((element) => {
          if (store.alreadyView.indexOf(element.id) !== -1) {
            element.isViewed = true
          } else {
            element.isViewed = false
          }
          return element
        }, this)
        store.addResultSearch(res.data)
        if (this.state.page <= res.data.total_pages) return this.setState({
          hasMore: this.state.page !== res.data.total_pages ? true : false
        })
      }).catch((err) => {
        store.addNotif('Themoviedb error', 'error')
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
