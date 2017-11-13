import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

import store from './utils/store'
import { local } from './utils/api'

import FrontBarre from './components/frontBarre'
import Login from './routes/login'
import Register from './routes/register'
import Popular from './routes/popular'
import Profile from './routes/profile'
import OtherProfile from './routes/otherProfile'
import TopRated from './routes/topRated'
import Movie from './routes/movie'
import Search from './routes/search'
import Reset from './routes/reset'
import Forget from './routes/forget'
import Notification from './components/notification'
import Play from './routes/play'

import './scss/index.css'

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hasToken: null
    }
  }

  componentWillMount () {
    if (global.localStorage.getItem('token')) {
      local().get('/user/me').then((res) => {
        if (res.data.success === true) {
          this.setState({ hasToken: true })
        } else {
          this.setState({ hasToken: false })
          store.addNotif(res.data.error, 'error')
          global.localStorage.removeItem('token')
          this.props.history.push('/login')
        }
      }).catch((err) => {
        this.setState({ hasToken: false })
        if (err.response) {
          store.addNotif(err.response.data.error, 'error')
          global.localStorage.removeItem('token')
          this.props.history.push('/login')
        }
      })
    }
    if (global.localStorage.getItem('token') &&
    (this.props.location.pathname === '/login' ||
    this.props.location.pathname === '/register' ||
      this.props.location.pathname.indexOf('/reset') !== -1 ||
    this.props.location.pathname === '/forget')) {
      this.props.history.push('/popular')
    }
    if (!global.localStorage.getItem('token') &&
    this.props.location.pathname !== '/login' &&
    this.props.location.pathname !== '/register' &&
    this.props.location.pathname.indexOf('/reset') === -1 &&
    this.props.location.pathname !== '/forget') {
      this.props.history.push('/login')
    }
  }

  componentWillReceiveProps (nextProps) {
    if (global.localStorage.getItem('token')) {
      local().get('/user/me').then((res) => {
        if (res.data.success === true) {
          this.setState({ hasToken: true })
        } else {
          this.setState({ hasToken: false })
          store.addNotif(res.data.error, 'error')
          global.localStorage.removeItem('token')
          this.props.history.push('/login')
        }
      }).catch((err) => {
        if (err.response) {
          this.setState({ hasToken: false })
          store.addNotif(err.response.data.error, 'error')
          global.localStorage.removeItem('token')
          this.props.history.push('/login')
        }
      })
    }
  }

  render () {
    return (
      <div id='container-root'>
        <Notification />
        {global.localStorage.getItem('token') ? <FrontBarre
          history={this.props.history}
          match={this.props.match}
          location={this.props.location} /> : null}
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/reset/:hash' component={Reset} />
          <Route exact path='/forget' component={Forget} />
          <Route exact path='/popular' component={Popular} />
          <Route exact path='/top_rated' component={TopRated} />
          <Route exact path='/profile' component={Profile} />
          <Route exact path='/profile/:id' component={OtherProfile} />
          <Route exact path='/movie/:id' component={Movie} />
          <Route exact path='/search/:id' component={Search} />
          <Route exact path='/play/:uuid/:id' component={Play} />
          {this.state.hasToken !== null
            ? this.state.hasToken
              ? <Redirect to='/popular' />
              : <Redirect to='/login' />
            : null}
        </Switch>
      </div>
    )
  }
}

export default Index

ReactDOM.render(
  <BrowserRouter>
    <Route component={Index} />
  </BrowserRouter>, document.getElementById('root'))

registerServiceWorker()
