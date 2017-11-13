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
      getViwed: false,
      alreadyView: [],
      hasMore: true,
    }
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  
  componentWillMount () {
    store.resetSearchRefresh()
    local().get('/view').then((res) => {
      if (res.data.success === true) {
        this.setState({
          alreadyView: res.data.result,
          getViwed: true
        })
      }
    }).catch((err) => {
      console.log(err.response)
    })
  }

  componentWillReceiveProps (nextProps) {
    store.resetSearchRefresh()
    this.setState({hasMore : true})
    local().get('/view').then((res) => {
      if (res.data.success === true) {
        this.setState({
          alreadyView: res.data.result,
          getViwed: true
        })
      }
    }).catch(() => {})
  }
  
  
  handleChangePage () {
    if ((store.totalPages >= 1 && store.totalPages < 1000 && store.pageSearchResult <= store.totalPages) || (store.refresh === true)) {
      tmdb().get(`search/movie`, {
        params: {
          page: store.pageSearchResult,
          query: this.props.match.params.id
        }
      }).then((res) => {
        res.data.results = res.data.results.map((tmdbElem) => {
          this.state.alreadyView.forEach(viewElem => {
            if (tmdbElem.id.toString() === viewElem.tmdbId && !tmdbElem.viewed) tmdbElem.viewed = true
            else if (!tmdbElem.viewed) tmdbElem.viewed = false
          })
          return tmdbElem
        }, this)
        store.addResultSearch(res.data)
        if (this.state.page <= res.data.total_pages) return this.setState({
          hasMore: this.state.page !== res.data.total_pages ? true : false
        })
      }).catch((err) => {
        console.log(err)
        store.addNotif('Themoviedb error', 'error')
      })
    }
  }

  render () {
    return (
      <div>
        {this.state.getViwed
          ? <Grid handleChangePage={this.handleChangePage} hasMore={this.state.hasMore} result={store.searchResult} history={this.props.history} />
          : null}
      </div>
    )
  }
}

export default Search
