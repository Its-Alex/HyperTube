import React, { Component } from 'react'
import Grid from '../components/grid'
import store from '../utils/store.js'
import { observer } from 'mobx-react'
import { tmdb } from '../utils/api.js'

@observer
class Popular extends Component {
  constructor (props) {
    super(props)

    this.state = {
      page: 1,
      hasMore: true,
      nbPage: ''
    }
    this._isMounted = false
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  handleChangePage () {
    tmdb().get(`movie/popular`, {
      params: {
        page: store.pageResultPopular
      }
    }).then((res) => {
      if (this.state.page === res.data.total_pages && this._isMounted === true) {
        this.setState({hasMore: false})
        this._isMounted = false
      }
      if (this._isMounted === true) {
        store.addResultPopular(res.data.results)
      }
    }).catch((err) => {
      console.log(err.response)
    })
  }

  render () {
    return (
      <div>
        <Grid handleChangePage={this.handleChangePage} hasMore={this.state.hasMore} result={store.resultPopular} history={this.props.history} />
      </div>
    )
  }
}

export default Popular
