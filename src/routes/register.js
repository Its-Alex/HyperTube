import React, { Component } from 'react'
import store from '../utils/store'
import { local } from '../utils/api'
import _ from 'lodash'
import Dropzone from 'react-dropzone'
import { Button, Input, Icon, Image } from 'semantic-ui-react'

import '../scss/register.css'

class Register extends Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      mail: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      loadingBtn: false,
      image: '../olivier/MP4/Screens.jpg'
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = _.debounce(this.handleSubmit.bind(this), 200)
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
      local().put('/user', {
        username: this.state.username,
        mail: this.state.mail,
        lastName: this.state.lastName,
        firstName: this.state.firstName,
        password: this.state.password,
        newPassword: this.state.confirmPassword,
        photo: '' // Need add base64 of photo!!
      })
      .then(res => {
        if (res.data.success === 'true') {
          this.props.history.push('/login')
        } else {
          store.addNotif(res.data.error, 'error')
        }
        this.setState({loadingBtn: false})
      })
      .catch(err => {
        this.setState({loadingBtn: false})
        if (err.response) {
          console.log(err.response)
          store.addNotif(err.response.data.error, 'error')
        }
      })
    }
  }

  render () {
    return (
      <div id='login' >
      <h1 className='title centerMiddle'>Hypertube</h1>
        <video loop autoPlay muted id="background-video">
            <source src="../olivier/MP4/Screens.mp4" type="video/mp4" />Your browser does not support the video tag. I suggest you upgrade your browser.
        </video>

      <div className='flexCenter'>
      <Image src='../olivier/Movie-icon.png' size='small' className='centerMiddle'/>
        <Dropzone>
          <img src={this.state.img} alt='profile' className='avatarRegister'/>
        </Dropzone>
        <Input
          type='text'
          placeholder='Username'
          name='username'
          label={{icon: 'child', className: 'label-login-btn', color: 'grey'}}
          className='input-login'
          value={this.state.username}
          onChange={this.handleChange}
          onKeyPress={this.stackDebounce.bind(this)}
        />

        <Input
          type='mail'
          placeholder='Mail'
          name='mail'
          label={{icon: 'inbox', className: 'label-login-btn', color: 'grey'}}
          className='input-login'
          value={this.state.mail}
          onChange={this.handleChange}
          onKeyPress={this.stackDebounce.bind(this)}
        />
        <Input
          type='text'
          placeholder='Lastname'
          name='lastName'
          label={{icon: 'user', className: 'label-login-btn', color: 'grey'}}
          className='input-login'
          value={this.state.lastName}
          onChange={this.handleChange}
          onKeyPress={this.stackDebounce.bind(this)}
        />
        <Input
          type='text'
          placeholder='Firstname'
          name='firstName'
          label={{icon: 'user', className: 'label-login-btn', color: 'grey'}}
          className='input-login'
          value={this.state.firstName}
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
        <Input
          type='password'
          placeholder='Password again'
          name='confirmPassword'
          label={{icon: 'lock', className: 'label-login-btn', color: 'grey'}}
          className='input-login'
          value={this.state.confirmPassword}
          onChange={this.handleChange}
          onKeyPress={this.stackDebounce.bind(this)}
        />
        <Button
          animated='fade'
          loading={this.state.loadingBtn}
          className='btn-login primary center'
          color='instagram'
          name='submit'
          onClick={this.stackDebounce.bind(this)} >
          <Button.Content visible>Register</Button.Content>
          <Button.Content hidden>
            <Icon name='right arrow' />
          </Button.Content>
        </Button>
        <a href="http://localhost:3000/login">Login</a>
      </div>
      </div>
    )
  }
}

export default Register
