import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

import App from './routes/app'
import Login from './routes/login'
import Register from './routes/register'
import './scss/index.css'

const ReactToastr = require('react-toastr')
const { ToastContainer } = ReactToastr
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation)

class Index extends React.Component {
  componentWillMount () {
    this.state = {
      toast: null
    }
  }

  componentDidMount () {
    this.setState({toast: this.refs.toast})
  }

  render () {
    return (
      <div id='container-toast'>
        <ToastContainer ref='toast'
          toastMessageFactory={ToastMessageFactory}
          preventDuplicates={false}
          className='toast-top-right' />
        <BrowserRouter>
          <Switch>
            <Route exact path='/login' render={({ match, location, history }) =>
              <Login match={match} location={location} history={history} toast={this.state.toast} />
            } />
            <Route exact path='/register' component={Register} />
            <Route path='/' component={App} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export default Index

ReactDOM.render(<Index />, document.getElementById('root'))

registerServiceWorker()
