import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

import App from './routes/app'
import FrontBarre from './components/frontBarre'
import Login from './routes/login'
import Register from './routes/register'
import Popular from './routes/popular'
import Profile from './routes/profile'
import OtherProfile from './routes/otherProfile'
import TopRated from './routes/topRated'
import Movie from './routes/movie'
import Search from './routes/search'
import './scss/index.css'

class Index extends React.Component {
  componentWillMount () {
    // if (!global.localStorage.getItem('token') &&
    // this.props.location.pathname !== '/login' &&
    // this.props.location.pathname !== '/register') {
    //   this.props.history.push('/login')
    // }
  }

  render () {
    return (
      <div id='container-toast'>
        {!global.localStorage.getItem('token') ? <FrontBarre
          history={this.props.history}
          match={this.props.match}
          location={this.props.location} /> : null}
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/accueil' component={({ match, location, history }) =>
            <Popular match={match} history={history} location={location} />
          } />
          <Route exact path='/top_rated' component={({match, location, history}) =>
            <TopRated match={match} hsitory={history} location={location} />
          } />
          <Route exact path='/profile' component={({match, location, history}) =>
            <Profile match={match} hsitory={history} location={location} />
          } />
          <Route exact path='/profile/:id' component={({match, location, history}) =>
            <OtherProfile match={match} hsitory={history} location={location} />
          } />
          <Route exact path='/movie/:id' component={({match, location, history}) =>
            <Movie match={match} hsitory={history} location={location} />
          } />
          <Route path='/' component={App} />
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
