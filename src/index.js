import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

import App from './routes/app'
import Login from './routes/login'
import Register from './routes/register'
import './scss/index.css'

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path='/login' component={Login} />
      <Route exact path='/register' component={Register} />
      <Route path='/' component={App} />
    </Switch>
  </BrowserRouter>
, document.getElementById('root'))

registerServiceWorker()
