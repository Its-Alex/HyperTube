import React, { Component } from 'react'
import { local } from '../utils/api.js'

class Comment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comments: [],
      writeCommnent: '',
      idMovie: ''
    }
    this.handleSendMess = this.handleSendMess.bind(this)
  }

  componentWillMount () {
    local().get(`/comment/${this.props.id}`).then((res) => {
      this.setState({
        idMovie: ''
      })
      console.log(res)
    }).catch((err) => {
      console.log(err.response)
    })
  }

  handleSendMess (e, message) {
    if (e.key === 'Enter') {
      local().post('/comment', {
        id: '',
        message: message
      }).then((res) => {
        local().get(`/comment/${this.props.id}`).then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err.response)
        })
      }).catch((err) => {
        console.log(err.response)
      })
      console.log(message)
    }
  }

  render () {
    return (
      <div>

      </div>
    )
  }
}

export default Comment
