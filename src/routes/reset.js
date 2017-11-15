import React, { Component } from 'react'
import { local } from '../utils/api'
import store from '../utils/store'
import { Form, Button, Segment } from 'semantic-ui-react'

class Reset extends Component {
  constructor (props) {
    super(props)
    this.state = {
      password: ''
    }
    this._isMounted = false
    this.handleAjax = this.handleAjax.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  componentWillUnmount () {
    this._isMounted = false
  }

  componentWillMount () {
    this._isMounted = true
  }

  handleChange (e) {
    if (this._isMounted === true) this.setState({ [e.target.name]: e.target.value })
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
        <Segment className='segmentReset'>
          <img className='logoImg' src='http://www.eatlogos.com/alphabet_logos/png/vector_h_cut_logo.png' alt='logo' />
          <Form className='formReset'>
            <Form.Field>
              <label>Your new password</label>
              <input type='password' name='password' value={this.state.password} onChange={this.handleChange} />
            </Form.Field>
            <Button name='reset' onClick={this.handleAjax}>Change password</Button>
          </Form>
        </Segment>
      </div>
    )
  }
}

export default Reset
