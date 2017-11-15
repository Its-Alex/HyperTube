import React, { Component } from 'react'
import store from '../utils/store'
import { local } from '../utils/api'
import { Form, Button, Segment } from 'semantic-ui-react'

class Forget extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mail: ''
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
    if (this._isMounted === true) this.setState({[e.target.name]: e.target.value})
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
        <Segment className='segmentForget'>
          <img className='logoImg' src='http://www.eatlogos.com/alphabet_logos/png/vector_h_cut_logo.png' alt='logo' />
          <Form className='formForget'>
            <Form.Field>
              <label>Your Email</label>
              <input name='mail' value={this.state.mail} onChange={this.handleChange} />
            </Form.Field>
            <Button name='reset' onClick={this.handleAjax}>new password</Button>
          </Form>
        </Segment>
      </div>
    )
  }
}

export default Forget
