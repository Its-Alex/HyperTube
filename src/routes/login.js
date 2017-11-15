import React, { Component } from 'react'
import { Button, Input, Icon, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import store from '../utils/store'
import { local } from '../utils/api'
import _ from 'lodash'

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mail: '',
      password: '',
      loadingBtn: false
    }
    this._isMounted = false
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = _.debounce(this.handleSubmit.bind(this), 200)
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  componentDidMount () {
    this._isMounted = true
    if (this.props.location.search !== '') {
      let str = this.props.location.search.substr(1).split('&').map((elmt) => {
        return elmt.split('=')
      })
      if (str[0][0] === 'success' && str[0][1] === 'true') {
        if (str[1][0] === 'token') {
          global.localStorage.setItem('token', str[1][1])
          global.localStorage.setItem('langue', 'en')
          this.props.history.push('/popular')
        }
      }
    }
  }

  handleChange (evt) {
    if (this._isMounted === true) this.setState({[evt.target.name]: evt.target.value})
  }

  stackDebounce (e, data) {
    if (e.key === 'Enter' || (data && data.name === 'submit')) {
      if (this._isMounted === true) this.setState({loadingBtn: true})
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
        if (this._isMounted === true) this.setState({loadingBtn: false})
        if (res.data.success === true) {
          global.localStorage.setItem('token', res.data.token)
          global.localStorage.setItem('langue', 'en')
          this.props.history.push('/popular')
        } else {
          store.addNotif(res.data.error, 'error')
        }
      })
      .catch(err => {
        if (this._isMounted === true) this.setState({loadingBtn: false})
        if (err.response) {
          store.addNotif(err.response.data.error, 'error')
        }
      })
    }
  }

  render () {
    return (
      <div id='login1'>
        <video loop autoPlay muted id='background-video' className='login1'>
          <source src='../olivier/MP4/Screens.mp4' type='video/mp4' />Your browser does not support the video tag. I suggest you upgrade your browser.
        </video>

        <div className='flexCenter'>
          <Image src='../olivier/Movie-icon.png' size='small' className='centerMiddle' />
          <Input
            type='text'
            placeholder='Mail'
            name='mail'
            label={{icon: 'mail square', className: 'label-login-btn', color: 'grey'}}
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
          <div />
          <Link to='register'>Register</Link>
          <Link to='forget'>Forgot password ?</Link>
        </div>
        <h1 className='title centerMiddle'>Hypertube</h1>

      </div>
    )
  }
}

export default Login
