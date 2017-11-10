import React, { Component } from 'react'
import Grid from '../components/grid'
import store from '../utils/store.js'
import { observer } from 'mobx-react'
import { tmdb } from '../utils/api.js'
import { Dropdown } from 'semantic-ui-react'

@observer
class Popular extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      hasMore: true,
      nbPage: '',
      choiceSort: 'popularity.desc',
      choiceOfSorts: 'Popularité Décroissante (Défaut)',
      choiceTheme: null,
      choiceOfTheme: 'All'
    }
    this._isMounted = false
    this.handleSortsChoice = this.handleSortsChoice.bind(this)
    this.handleSortTheme = this.handleSortTheme.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  handleSortsChoice (choice, name) {
    store.resetPopular()
    console.log(name)
    this.setState({
      choiceSort: choice,
      choiceOfSorts: name,
      hasMore: true
    })
  }
  
  handleSortTheme (num, name) {
    store.resetPopular()
    if (num === 0) {
      this.setState({
        choiceOfTheme: name,
        choiceTheme: null,
        choiceSort: 'popularity.desc',
        choiceOfSorts: 'Popularité Décroissante (défaut)',
        hasMore: true
      })        
    } else {
      this.setState({
        choiceOfTheme: name,
        choiceTheme: num,
        choiceSort: 'popularity.desc',
        choiceOfSorts: 'Popularité Décroissante (défaut)',
        hasMore: true
      })
    }
  }
  
  handleChangePage () {
    tmdb().get(`discover/movie`, {
      params: {
        page: store.pageResultPopular,
        sort_by: this.state.choiceSort,
        with_genres: this.state.choiceTheme
        
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
        <Dropdown text={this.state.choiceOfSorts} icon='filter' floating labeled button className='icon'>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => {this.handleSortsChoice('popularity.desc', 'Pop Décroissante (défaut)')}}>Pop Décroissante (défaut)</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortsChoice('popularity.asc', 'Pop Croissante')}}>Pop Croissante</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortsChoice('release_date.desc', 'Date Décroissante')}}>Date Décroissante</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortsChoice('release_date.asc', 'Date Croissante')}}>Date Croissante</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortsChoice('vote_average.desc', 'Vote Décroissante')}}>Vote Décroissante</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortsChoice('vote_average.asc', 'Vote Croissant')}}>Vote Croissant</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown text={this.state.choiceOfTheme} icon='filter' floating scrolling labeled button className='icon'>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => {this.handleSortTheme(0, 'All (défaut)')}}>All (défaut)</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(28, 'Action')}}>Action</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(12, 'Adventure')}}>Adventure</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(16, 'Animation')}}>Animation</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(35, 'Comedy')}}>Comedy</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(80, 'Crime')}}>Crime</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(99, 'Documentary')}}>Documentary</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(18, 'Drama')}}>Drama</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(10751, 'Family')}}>Family</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(14, 'Fantasy')}}>Fantasy</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(36, 'History')}}>History</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(27, 'Horro')}}>Horror</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(9648, 'Mystery')}}>Mystery</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(10749, 'Romance')}}>Romance</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(878, 'Science Fiction')}}>Science Fiction</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(53, 'Thriller')}}>Thriller</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(10752, 'War')}}>War</Dropdown.Item>
            <Dropdown.Item onClick={() => {this.handleSortTheme(37, 'Western')}}>Western</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Grid handleChangePage={this.handleChangePage} hasMore={this.state.hasMore} result={store.resultPopular} history={this.props.history} />
      </div>
    )
  }
}

export default Popular
