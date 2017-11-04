import React, { Component } from 'react'
import { local } from '../utils/api.js'

class Comment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comments: [],
      message: '',
      uuid: this.props.uuid
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSendMess = this.handleSendMess.bind(this)
  }

  componentWillMount () {
    local().get(`/comment/${this.props.uuid}`).then((res) => {
      this.setState({
        comments: res.data.result
      })
      setTimeout(() => {
        console.log(this.state.comments)
      }, 1000)
    }).catch((err) => {
      console.log(err.response)
    })
  }

  handleChange (evt) {
    this.setState({
      message: evt.target.value
    })
  }

  handleClick (id) {
    this.props.history.push(`/user/${id}`)
  }

  handleSendMess (evt, message) {
    if ((evt.key === 'Enter' || evt === 'submit') && this.state.message !== '') {
      local().put(`/comment/${this.state.uuid}`, {
        id: this.state.uuid,
        comment: this.state.message
      }).then((res) => {
        if (res.data.success === true) {
          local().get(`/comment/${this.state.uuid}`).then((res) => {
            this.setState({
              comments: res.data.result,
              message: ''
            })
            setTimeout(() => {
              console.log(this.state.comments)
            }, 1000)
          }).catch((err) => {
            console.log(err.response)
          })
        }
      }).catch((err) => {
        console.log(err.response)
      })
      console.log(message)
    }
  }

  render () {
    return (
      <div>
        {this.state.comments.map((result, index) => {
          return (
            <div key={index}>
              <div onClick={() => { this.handleClick(result.userId) }}>{result.username}</div>
              <div>{result.id}</div>
              <div>{result.date}</div>
              <div>{result.comment}</div>
            </div>
          )
        })}
        <input value={this.state.message} name='message' onChange={this.handleChange} onKeyPress={(evt) => { this.handleSendMess(evt, this.state.message) }} />
        <button name='submit' onClick={(evt) => { this.handleSendMess('submit', this.state.message) }} />
      </div>
    )
  }
}

export default Comment
