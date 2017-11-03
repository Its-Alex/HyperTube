import React, { Component } from 'react'
import { Button, Input, Icon } from 'semantic-ui-react'
import store from '../utils/store'
import { local } from '../utils/api'
import _ from 'lodash'

import '../scss/login.css'

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mail: '',
      password: '',
      loadingBtn: false,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = _.debounce(this.handleSubmit.bind(this), 200)
  }

  componentDidMount () {
    if (this.props.location.search !== '') {
      let str = this.props.location.search.substr(1).split('&').map((elmt) => {
        return elmt.split('=')
      })
      if (str[0][0] === 'success' && str[0][1] === 'true') {
        if (str[1][0] === 'token') {
          global.localStorage.setItem('token', str[1][1])
          this.props.history.push('/popular')
        }
      }
    }
  }

  handleChange (evt) {
    this.setState({[evt.target.name]: evt.target.value})
  }

  stackDebounce (e, data) {
    if (e.key === 'Enter' || (data && data.name === 'submit')) {
      this.setState({loadingBtn: true})
    }
    this.handleSubmit(e.key, data)
  }

  handleSubmit (key, data) {
    if (key === 'Enter' || (data && data.name === 'submit')) {
      local().post('/user', {
        mail: this.state.mail,
        password: this.state.password
      })
      .then(res => {
        this.setState({loadingBtn: false})
        if (res.data.success === true) {
          global.localStorage.setItem('token', res.data.token)
          this.props.history.push('/popular')
        } else {
          store.addNotif(res.data.error, 'error')
        }
      })
      .catch(err => {
        this.setState({loadingBtn: false})
        console.log(err.response)
        if (err.response) {
          store.addNotif(err.response.data.error)
        }
      })
    }
  }

  render () {
    return (
      <div id='login'>

      <h1 className='title centerMiddle'>Hypertube</h1>

      <video loop autoPlay muted id="background-video">
          <source src="../olivier/MP4/Screens.mp4" type="video/mp4" />Your browser does not support the video tag. I suggest you upgrade your browser.
      </video>



      <div className='flexCenter'>
          <Input
            type='text'
            placeholder='Mail'
            name='mail'
            label={{icon: 'mail', className: 'label-login-btn', color: 'grey'}}
            className='input-login'
            value={this.state.mail}
            onChange={this.handleChange}
            onKeyPress={this.stackDebounce.bind(this)}
          />
          <Input
            type='password'
            placeholder='Password'
            name='password'
            label={{icon: 'lock', className: 'label-login-btn', color: 'grey'}}
            className='input-login'
            value={this.state.password}
            onChange={this.handleChange}
            onKeyPress={this.stackDebounce.bind(this)}
          />
          <Button
            animated='fade'
            loading={this.state.loadingBtn}
            className='btn-login myButtonCenter '
            color='instagram'
            name='submit'
            onClick={this.stackDebounce.bind(this)} >
            <Button.Content visible>Login</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow' />
            </Button.Content>
          </Button>
          <Button.Group>
            <Button color='facebook'
              onClick={() => {
                window.location.href = 'http://localhost:3005/auth/facebook'
              }}>
              <Icon name='facebook' /> FB
            </Button>
            <Button
              onClick={() => {
                window.location.href = 'http://localhost:3005/auth/github'
              }}>
              <Icon name='github' /> GitHub
            </Button>
            <Button
              onClick={() => {
                window.location.href = 'http://localhost:3005/auth/42'
              }}>
              <Icon name='code' /> 42
            </Button>
          </Button.Group>
        </div>






      </div>
    )
  }
}

export default Login
