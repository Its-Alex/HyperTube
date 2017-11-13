import React, { Component } from 'react'
import { observer } from 'mobx-react'
import store from '../utils/store.js'
import { tmdb, local } from '../utils/api.js'

import Grid from '../components/grid'

@observer
class TopRated extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      hasMore: true,
      nbPage: '',
      getViwed: false,
      alreadyView: []
    }
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  componentWillMount() {
    store.resetTopRated()
    if (this.props.history !== undefined) {
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
  }

  handleChangePage () {
    tmdb().get('discover/movie', {
      params: {
        page: store.pageResultTopRated,
        sort_by: 'vote_count.desc',
        language: 'fr'
      }
    }).then((res) => {
      res.data.results = res.data.results.map((tmdbElem) => {
        this.state.alreadyView.forEach(viewElem => {
          if (tmdbElem.id.toString() === viewElem.tmdbId && !tmdbElem.viewed) tmdbElem.viewed = true
          else if (!tmdbElem.viewed) tmdbElem.viewed = false
        })
        return tmdbElem
      }, this)
      if (this.state.page === res.data.total_pages) this.setState({hasMore: false})
      store.addResultTopRated(res.data.results)
    }).catch((err) => {
      store.addNotif('Themoviedb error', 'error')
    })
  }

  render () {
    return (
      <div>
        { this.state.getViwed
          ? <Grid handleChangePage={this.handleChangePage} hasMore={this.state.hasMore} result={store.resultTopRated} history={this.props.history} />
          : null}
      </div>
    )
  }
}

export default TopRated
