import React, { Component } from 'react'
import axios from 'axios'
import Grid from '../components/grid'
import store from '../utils/store.js'
import { observer } from 'mobx-react'

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
    axios.get(`https://api.themoviedb.org/3/movie/popular`, {
      params: {
        api_key: '4add767f00472cadffc84346bd8572e6',
        page: this.state.page,
        language: 'fr'
      }
    }).then((res) => {
      if (this.state.page === res.data.total_pages && this._isMounted === true) {
        this.setState({hasMore: false})
        this._isMounted = false
      } else {
        this.setState({
          page: this.state.page + 1
        })
      }
      if (this._isMounted === true) {
        store.addResultPopular(res.data.results)
      }
      console.log(this.state.hasMore)
    }).catch((err) => {
      console.log(err)
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
