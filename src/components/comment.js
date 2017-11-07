import React, { Component } from 'react'
import store from '../utils/store'
import Moment from 'react-moment'
import { local } from '../utils/api.js'
import { observer } from 'mobx-react'
import { Form, Comment } from 'semantic-ui-react'

@observer

class Comments extends Component {
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
    }).catch((err) => {
      if (err.response) {
        store.addNotif(err.response.data.error, 'error')
        console.log(err.response)
      }
    })
  }

  handleChange (evt) {
    this.setState({
      message: evt.target.value
    })
  }

  handleClick (id) {
    this.props.history.push(`/profile/${id}`)
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
          }).catch((err) => {
            if (err.response) {
              store.addNotif(err.response.data.error, 'error')
              console.log(err.response)
            }
          })
        }
      }).catch((err) => {
        if (err.response) {
          store.addNotif(err.response.data.error, 'error')
          console.log(err.response)
        }
      })
    }
  }

  render () {
    return (
      <div className="commentBlock">
        {this.state.comments.map((result, index) => {
          return (
            <Comment.Group className="contentGroup">
              <Comment key={index}>
                <Comment.Content>
                  <div className="commentUser" onClick={() => { this.handleClick(result.userId) }}>{result.username}</div>
                  <Comment.Metadata className="commentDate">
                    <Moment to={result.date} />
                  </Comment.Metadata>
                  <div className="commentCom">{result.comment}</div>
                  </Comment.Content>
              </Comment>
            </Comment.Group>
          )
        })}
        <Form>
          <Form.Input value={this.state.message} name='message' onChange={this.handleChange} onKeyPress={(evt) => { this.handleSendMess(evt, this.state.message) }} />
          <Form.Button name='submit' content="Submit" onClick={(evt) => { this.handleSendMess('submit', this.state.message) }} />
        </Form>
      </div>
    )
  }
}

export default Comments
