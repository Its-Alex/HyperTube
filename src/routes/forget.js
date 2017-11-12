import React, { Component } from 'react'
import store from '../utils/store'
import { local } from '../utils/api'

class Forget extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mail: ''
    }
    this.handleAjax = this.handleAjax.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  handleAjax () {
    local().post('/user/forget', {
      mail: this.state.mail
    }).then(res => {
      if (res.data.success === true) {
        store.addNotif('Mail send', 'success')
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
      <div className='forget'>
        <input name='mail' value={this.state.mail} onChange={this.handleChange} />
        <button name='reset' onClick={this.handleAjax}>Ask new password</button>
      </div>
    )
  }
}

export default Forget
