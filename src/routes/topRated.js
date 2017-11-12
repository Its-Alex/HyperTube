import React, { Component } from 'react'
import { tmdb, local } from '../utils/api.js'
import Grid from '../components/grid'
import store from '../utils/store.js'
import { observer } from 'mobx-react'

@observer

class TopRated extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      hasMore: true,
      nbPage: '',
      alreadyView: []      
    }
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  componentWillMount () {
    local().get('/view').then((res) => {
      if (res.data.success === true) {
       this.setState({alreadyView: res.data.result})
      }
    }).catch((err) => {
       console.log(err.response)
    })
  }

  handleChangePage () {
    tmdb().get('discover/movie', {
      params: {
        page: store.pageResultTopRated,
        sort_by: 'vote_count.desc',
        language: 'fr'
      }
    }).then((res) => {
      res.data.results = res.data.results.map((element) => {
        if (this.state.alreadyView.indexOf(element.id) !== -1) {
          element.isViewed = true
        } else {
          element.isViewed = false
        }
        return element
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
        <Grid handleChangePage={this.handleChangePage} hasMore={this.state.hasMore} result={store.resultTopRated} history={this.props.history} />
      </div>
    )
  }
}

export default TopRated
