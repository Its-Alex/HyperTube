import React, { Component } from 'react'
import { Button, Input, Icon } from 'semantic-ui-react'
import _ from 'lodash'
import axios from 'axios'

import '../scss/login.css'

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      mail: '',
      password: '',
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
      axios.post('http://localhost:3005/user', {
        mail: this.state.mail,
        password: this.state.password
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
      <div id='login'>
        <Input
          type='text'
          placeholder='Mail'
          name='mail'
          label={{content: 'Mail', className: 'label-login-btn', color: 'grey'}}
          className='input-login'
          value={this.state.mail}
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
        <Button
          animated='fade'
          loading={this.state.loadingBtn}
          className='btn-login'
          color='instagram'
          name='submit'
          onClick={this.stackDebounce.bind(this)} >
          <Button.Content visible>Login</Button.Content>
          <Button.Content hidden>
            <Icon name='right arrow' />
          </Button.Content>
        </Button>
        <Button.Group>
          <Button color='facebook'>
            <Icon name='facebook' /> FB
          </Button>
          <Button>
            <Icon name='github' /> GitHub
          </Button>
          <Button>
            <Icon name='code' /> 42
          </Button>
        </Button.Group>
      </div>
    )
  }
}

export default Login
