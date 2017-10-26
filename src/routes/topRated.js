import React, { Component } from 'react'
import axios from 'axios'
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
      nbPage: ''
    }
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  handleChangePage () {
    axios.get(`https://api.themoviedb.org/3/movie/top_rated`, {
      params: {
        api_key: '4add767f00472cadffc84346bd8572e6',
        page: this.state.page,
        language: 'fr',
        sort_by: 'popularity.desc'
      }
    }).then((res) => {
      if (this.state.page === res.data.total_pages) this.setState({hasMore: false})
      store.addResultTopRated(res.data.results)
      this.setState({
        page: this.state.page + 1
      })
    }).catch((err) => {
      console.log(err)
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
