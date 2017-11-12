import React, { Component } from 'react'
import { local } from '../utils/api'
import store from '../utils/store'

class Reset extends Component {
  constructor (props) {
    super(props)
    this.state = {
      password: ''
    }
    this.handleAjax = this.handleAjax.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    console.log(this.props.match.params.hash)
    this.setState({ [e.target.name]: e.target.value })
  }

  handleAjax () {
    local().post('/user/reset', {
      token: this.props.match.params.hash,
      password: this.state.password
    }).then(res => {
      if (res.data.success === true) {
        store.addNotif('Password change', 'success')
        this.props.history.push('/login')
      } else {
        store.addNotif(res.data.error, 'error')
      }
    }).catch(err => {
      if (err.response) {
        store.addNotif(err.response.data.error, 'error')
      }
    })
  }

  render () {
    return (
      <div className='reset'>
        <input name='password' value={this.state.password} onChange={this.handleChange} />
        <button name='reset' onClick={this.handleAjax}>Change password</button>
      </div>
    )
  }
}

export default Reset
