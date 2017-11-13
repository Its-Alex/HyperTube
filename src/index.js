import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

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
  componentWillMount () {
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
          <Redirect to='/popular' />
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
