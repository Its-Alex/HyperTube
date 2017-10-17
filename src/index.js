import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

import App from './routes/app'
import Login from './routes/login'
import Register from './routes/register'
import Accueil from './routes/accueil'
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
        <BrowserRouter>
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/Accueil' component={Accueil} />
            <Route path='/' component={App} />
          </Switch>
        </BrowserRouter>
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
