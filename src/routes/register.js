import React, { Component } from 'react'
import axios from 'axios'
import _ from 'lodash'
import Dropzone from 'react-dropzone'
import { Button, Input, Icon } from 'semantic-ui-react'

class Register extends Component {
  componentWillMount () {
    this.state = {
      username: '',
      mail: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      loadingBtn: false
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
      axios.put('http://localhost:3005/user/signup', {
        username: this.state.username,
        mail: this.state.mail,
        lastName: this.state.lastName,
        firstName: this.state.firstName,
        password: this.state.password,
        newPassword: this.state.confirmPassword
      })
      .then(res => {
        this.setState({loadingBtn: false})
      })
      .catch(err => {
        this.setState({loadingBtn: false})
        console.log(err.response)
      })
    }
  }

  render () {
    return (
      <div id='login' >
        <Dropzone>
          <img src={this.state.img} alt='profile' />
        </Dropzone>
        <Input
          type='text'
          placeholder='Username'
          name='username'
          label={{content: 'Username', className: 'label-login-btn', color: 'grey'}}
          className='input-login'
          value={this.state.username}
          onChange={this.handleChange}
          onKeyPress={this.stackDebounce.bind(this)}
        />
        <Input
          type='mail'
          placeholder='Mail'
          name='mail'
          label={{content: 'Mail', className: 'label-login-btn', color: 'grey'}}
          className='input-login'
          value={this.state.mail}
          onChange={this.handleChange}
          onKeyPress={this.stackDebounce.bind(this)}
        />
        <Input
          type='text'
          placeholder='Lastname'
          name='lastName'
          label={{content: 'Lastname', className: 'label-login-btn', color: 'grey'}}
          className='input-login'
          value={this.state.lastName}
          onChange={this.handleChange}
          onKeyPress={this.stackDebounce.bind(this)}
        />
        <Input
          type='text'
          placeholder='Firstname'
          name='firstName'
          label={{content: 'Firstname', className: 'label-login-btn', color: 'grey'}}
          className='input-login'
          value={this.state.firstName}
          onChange={this.handleChange}
          onKeyPress={this.stackDebounce.bind(this)}
        />
        <Input
          type='password'
          placeholder='Password'
          name='password'
          label={{content: 'Password', className: 'label-login-btn', color: 'grey'}}
          className='input-login'
          value={this.state.password}
          onChange={this.handleChange}
          onKeyPress={this.stackDebounce.bind(this)}
        />
        <Input
          type='password'
          placeholder='Password'
          name='confirmPassword'
          label={{content: 'Confirm', className: 'label-login-btn', color: 'grey'}}
          className='input-login'
          value={this.state.confirmPassword}
          onChange={this.handleChange}
          onKeyPress={this.stackDebounce.bind(this)}
        />
        <Button
          animated='fade'
          loading={this.state.loadingBtn}
          className='btn-login'
          color='instagram'
          name='submit'
          onClick={this.stackDebounce.bind(this)} >
          <Button.Content visible>Register</Button.Content>
          <Button.Content hidden>
            <Icon name='right arrow' />
          </Button.Content>
        </Button>
      </div>
    )
  }
}

export default Register
