import React from 'react'
import { Input, Feed, Grid, Icon, Modal, Button, Form } from 'semantic-ui-react'
import '../scss/profile.css'
import _ from 'lodash'
import axiosInst from '../utils/axiosInst.js'

class Profile extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      profileFirtName: '',
      profileLastName: '',
      profileUserName: '',
      profileId: '',
      firstname: '',
      lastname: '',
      login: '',
      email: '',
      oldpswd: '',
      newpswd: '',
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
      axiosInst().patch('/user/me', {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        username: this.state.login,
        mail: this.state.email,
        password: this.state.oldpswd,
        newPassword: this.state.newpswd
      })
      .then(res => {
        console.log(res)
        // Get error res.data.error
        /**
         * Need to handle and show error
         */
        this.setState({
          loadingBtn: false
        })
      })
      .catch(err => {
        console.log(err.response)
        // Get error err.response.data.error
        /**
         * Need to handle and show error
         */
        this.setState({loadingBtn: false})
      })
    }
  }

  editProfile () {
    return (
      <Button
        animated='fade'
        className='editProfile'>
        <Button.Content visible>
          <Icon name='pencil' />
        </Button.Content>
        <Button.Content hidden>Edit</Button.Content>
      </Button>
    )
  }
  feedEmail () {
    return (
      <Feed.Event>
        <Feed.Label icon='mail' />
        <Feed.Content>
          <Feed.Extra text>
            thgiraud@student.42.fr
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
    )
  }
  componentWillMount () {
    axiosInst().get('/user/me').then((res) => {
      console.log(res)
      this.setState({
        profileFirstName: res.data.user.firstName,
        profileLastName: res.data.user.lastName,
        profileUserName: res.data.user.username,
        profileMail: res.data.user.mail,
        profileId: res.data.user.id
      })
    }).catch((err) => {
      console.log(err)
    })
  }
  editUser () {
    return (
      <Form className='editForm'>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>First name</label>
            <Input
              id='firstname'
              placeholder='First name'
              name='firstname'
              value={this.state.firstname}
              onChange={this.handleChange}
              onKeyPress={this.stackDebounce.bind(this)}
            />
          </Form.Field>
          <Form.Field>
            <label>Last name</label>
            <Input
              id='lastname'
              placeholder='Last name'
              name='lastname'
              value={this.state.lastname}
              onChange={this.handleChange}
              onKeyPress={this.stackDebounce.bind(this)}
            />
          </Form.Field>
          <Form.Field>
            <label>Login</label>
            <Input
              id='login'
              placeholder='Login'
              name='login'
              value={this.state.login}
              onChange={this.handleChange}
              onKeyPress={this.stackDebounce.bind(this)}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Email</label>
            <Input
              id='email'
              type='email'
              name='email'
              placeholder='Email'
              value={this.state.email}
              onChange={this.handleChange}
              onKeyPress={this.stackDebounce.bind(this)}
            />
          </Form.Field>
          <Form.Field>
            <label>Old password</label>
            <Input
              id='oldpswd'
              type='password'
              placeholder='Old password'
              name='oldpswd'
              value={this.state.oldpswd}
              onChange={this.handleChange}
              onKeyPress={this.stackDebounce.bind(this)}
            />
          </Form.Field>
          <Form.Field>
            <label>New password</label>
            <Input
              id='newpswd'
              type='password'
              placeholder='Last name'
              name='newpswd'
              value={this.state.newpswd}
              onChange={this.handleChange}
              onKeyPress={this.stackDebounce.bind(this)}
            />
          </Form.Field>
        </Form.Group>
        <Button
          animated='fade'
          loading={this.state.loadingBtn}
          className='fluid btn-login'
          color='instagram'
          name='submit'
          onClick={this.stackDebounce.bind(this)} >
          <Button.Content visible>Edit</Button.Content>
          <Button.Content hidden>
            <Icon name='right arrow' />
          </Button.Content>
        </Button>
      </Form>
    )
  }
  render () {
    return (
      <div>
        <div
          className='backPic'
          style={{backgroundImage: 'url(http://localhost:3005/picture/' + this.state.profileId + ')'}}
        />
        <Grid celled='internally'>
          <Grid.Row>
            <Grid.Column width={12} textAlign='center'>
              <Modal
                trigger={this.editProfile()}
                header='Edit your Profile !'
                content={this.editUser()}
                actions={[
                  'Close'
                ]}
              />
              <div className='userName'>
                {this.state.profileFirstName} {this.state.profileLastName}
              </div>
              <div className='userLogin'>
                {this.state.profileUserName}
              </div>
              <hr />
              <div>
                {this.feedEmail()}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default Profile
