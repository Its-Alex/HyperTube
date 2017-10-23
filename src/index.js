import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

import App from './routes/app'
import FrontBarre from './components/frontBarre'
import Login from './routes/login'
import Register from './routes/register'
import Accueil from './routes/accueil'
import Profile from './routes/profile'
import OtherProfile from './routes/otherProfile'
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
        {!global.localStorage.getItem('token') ? <FrontBarre /> : null}
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/accueil' component={Accueil} />
          <Route exact path='/profile' component={Profile} />
          <Route exact path='/profile/:id' component={OtherProfile} />
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
