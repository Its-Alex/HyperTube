import React, { Component } from 'react'
import Grid from '../components/grid'
import store from '../utils/store.js'
import { observer } from 'mobx-react'
import { tmdb } from '../utils/api.js'
import { Dropdown, Menu, Input, Button } from 'semantic-ui-react'

function getDiff (start, end) {
  if ((2020 < parseInt(start.substr(0, 4) ,10)) || (parseInt(end.substr(0, 4) ,10) > 2020)) {
    return false
  }
  let year = parseInt(start.substr(0, 4), 10) - parseInt(end.substr(0, 4), 10)
  if (year === 0) {
    let month = parseInt(start.substr(5, 2), 10) - parseInt(end.substr(5, 2), 10)
    if (month === 0) {
      let day = parseInt(start.substr(8, 2), 10) - parseInt(end.substr(8, 2), 10)
      if (day === 0) {
        return true
      } else if (day < 0) return true
      else return false
    } else if (month < 0) return true 
    else return false
  } else if (year < 0) return true
  else return false
}

@observer
class Popular extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      hasMore: true,
      nbPage: '',
      choiceSort: 'popularity.desc',
      choiceOfSorts: 'Trie',
      choiceTheme: null,
      choiceOfTheme: 'Genre',
      startDate: '',
      endDate: '',
      startDate1: '',
      endDate1: '',
      useDate: false
    }
    this._isMounted = false
    this.handleSortsChoice = this.handleSortsChoice.bind(this)
    this.handleSortTheme = this.handleSortTheme.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleStartTrie = this.handleStartTrie.bind(this)
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false
  }
  

  handleSortsChoice (choice, name) {
    this.setState({
      choiceSort: choice,
      choiceOfSorts: name,
    })
  }
  
  handleSortTheme (num, name) {
    if (num === 0) {
      this.setState({
        choiceOfTheme: name,
        choiceTheme: null
      })        
    } else {
      this.setState({
        choiceOfTheme: name,
        choiceTheme: num
      })
    }    
  }
  
  handleChangePage () {
    tmdb().get(`discover/movie`, {
      params: {
        page: store.pageResultPopular,
        sort_by: this.state.choiceSort,
        with_genres: this.state.choiceTheme,
        'primary_release_date.gte': this.state.startDate1,    // Date la plus vieille
        'primary_release_date.lte':  this.state.endDate1  // Date la plus recente
      }
    }).then((res) => {
      if (this.state.page === res.data.total_pages && this._isMounted === true) {
        store.addResultPopular(res.data.results)
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

  handleChangeDate (evt) {
    this.setState({[evt.target.name]: evt.target.value}, () => {
      if (!this.state.startDate.match(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/) ||
      !this.state.endDate.match(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/)) {
        this.setState({
          useDate: false
        })
      } else {
        this.setState({
          startDate1: this.state.startDate,
          endDate1: this.state.endDate,
          useDate: true
        })
      }
    })
  }

  handleStartTrie () {
    if (getDiff(this.state.startDate1, this.state.endDate1) === true) {
      store.resetPopular()
      setTimeout(() => {
        this._isMounted = true
        this.setState({
          hasMore: true
        })
      }, 800);
    }
  }

  render () {
    return (
      <div>
        <Menu stackable>
          <Menu.Item>
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
          </Menu.Item>
          <Menu.Item>
          <Dropdown text={this.state.choiceOfSorts} icon='filter' floating labeled button className='icon'>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => {this.handleSortsChoice('popularity.desc', 'Popularité Décroissante (défaut)')}}>Pop Décroissante (défaut)</Dropdown.Item>
              <Dropdown.Item onClick={() => {this.handleSortsChoice('popularity.asc', 'Popularité Croissante')}}>Pop Croissante</Dropdown.Item>
              <Dropdown.Item onClick={() => {this.handleSortsChoice('release_date.desc', 'Date Décroissante')}}>Date Décroissante</Dropdown.Item>
              <Dropdown.Item onClick={() => {this.handleSortsChoice('release_date.asc', 'Date Croissante')}}>Date Croissante</Dropdown.Item>
              <Dropdown.Item onClick={() => {this.handleSortsChoice('vote_average.desc', 'Vote Décroissante')}}>Vote Décroissante</Dropdown.Item>
              <Dropdown.Item onClick={() => {this.handleSortsChoice('vote_average.asc', 'Vote Croissant')}}>Vote Croissant</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          </Menu.Item>
          <Menu.Item>
            <Menu.Header>Compris entre :</Menu.Header>
            </Menu.Item>
          <Menu.Item>            
            <Input name='startDate' onChange={this.handleChangeDate} focus placeholder='Format: 2017/11/10' />
          </Menu.Item>
          <Menu.Item>
            <Menu.Header>et</Menu.Header>
            </Menu.Item>
          <Menu.Item>
            <Input name='endDate' onChange={this.handleChangeDate} focus placeholder='Format: 2017/11/10' />
          </Menu.Item>
          <Menu.Item>
            <Button onClick={this.handleStartTrie}>Trie</Button>
          </Menu.Item>
        </Menu>
        <Grid handleChangePage={this.handleChangePage} hasMore={this.state.hasMore} result={store.resultPopular} history={this.props.history} />
      </div>
    )
  }
}

export default Popular
