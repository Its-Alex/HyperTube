import React, { Component } from 'react'
import axios from 'axios'
import Grid from '../components/grid'

class Search extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      result: [],
      hasMore: true,
      nbPage: '',
      query: this.props.match.params.id
    }
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  handleChangePage () {
    console.log(this.state.query)
    console.log(this.state.page)
    axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: '4add767f00472cadffc84346bd8572e6',
        page: this.state.page,
        query: this.state.query
      }
    }).then((res) => {
      if (this.state.page === res.data.total_pages) this.setState({hasMore: false})
      this.setState({
        page: this.state.page + 1,
        result: this.state.result.concat(res.data.results)
      })
      console.log(res.data.results)
    }).catch((err) => {
      console.log(err)
    })
  }

  componentWillMount () {
    if (this.props.match.params.id === undefined || this.props.match.params.id === '') {
      this.props.history.push('/accueil')
    }
  }
  render () {
    return (
      <div>
        <Grid handleChangePage={this.handleChangePage} hasMore={this.state.hasMore} result={this.state.result} />
      </div>
    )
  }
}

export default Search
