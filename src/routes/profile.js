import React from 'react'
import { Input, Feed, Grid, Icon, Modal, Button, Form } from 'semantic-ui-react'
import store from '../utils/store'
import { local } from '../utils/api.js'
import { observer } from 'mobx-react'
import _ from 'lodash'
import Dropzone from 'react-dropzone'


@observer
class Profile extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      profileFirtName: '',
      profileLastName: '',
      profileUserName: '',
      profileMail: '',
      profileId: '',
      firstname: '',
      lastname: '',
      login: '',
      email: '',
      oldpswd: '',
      newpswd: '',
      loadingBtn: false,
      connectFacebook: false,
      connectGitHub: false,
      connectFortyTwo: false,
    }
    this._isMounted = false
    this.handleChangeLangue = this.handleChangeLangue.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = _.debounce(this.handleSubmit.bind(this), 200)
  }

  componentWillUnmount () {
    this._isMounted = false
  }
  
  componentWillMount () {
    this._isMounted = true
    local().get('/user/me').then((res) => {
      if (this._isMounted === true) this.setState({
        profileFirstName: res.data.user.firstName,
        profileLastName: res.data.user.lastName,
        profileUserName: res.data.user.username,
        profileMail: res.data.user.mail,
        profileId: res.data.user.id + '?date=',
        connectFacebook: res.data.user.isConnectFacebook,
        connectFortyTwo: res.data.user.isConnectFortyTwo,
        connectGitHub: res.data.user.isConnectGithub,
        image: ''
      })
    }).catch((err) => {
      if (err.response) {
        store.addNotif(err.response.data.error, 'error')
      }
    })
  }

  handleChange (evt) {
    if (this._isMounted === true) this.setState({[evt.target.name]: evt.target.value})
  }

  handleChangeLangue (langue) {
    if (langue !==  global.localStorage.getItem('langue')) {
      global.localStorage.setItem('langue', langue)
      store.modifyLangue()
      store.addNotif('Language Changed', 'success')
    }
  }

  stackDebounce (e, data) {
    if (e.key === 'Enter' || (data && data.name === 'submit')) {
      if (this._isMounted === true) this.setState({loadingBtn: true})
    }
    this.handleSubmit(e.key, data)
  }

  handleSubmit (key, data) {
    if (key === 'Enter' || (data && data.name === 'submit')) {
      local().patch('/user', {
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        username: this.state.login,
        mail: this.state.email,
        password: this.state.oldpswd,
        newPassword: this.state.newpswd
      })
      .then(res => {
        if (res.data.success === true) {
          store.addNotif('Profile changed', 'success')
          if (this._isMounted === true) this.setState({
            profileFirstName: res.data.user.firstName,
            profileLastName: res.data.user.lastName,
            profileMail: res.data.user.mail,
            profileUserName: res.data.user.username,
            firstname: '',
            lastname: '',
            login: '',
            email: '',
            oldpswd: '',
            newpswd: '',
            loadingBtn: false
          })
        } else {
          store.addNotif(res.data.error, 'error')
        }
      })
      .catch(err => {
        if (this._isMounted === true) this.setState({loadingBtn: false})
        if (err.response) {
          store.addNotif(err.response.data.error, 'error')
        }
      })
    }
  }
  onDrop (acceptedFiles, rejectedFiles) {
    let self = this
    acceptedFiles.forEach(file => {
      var reader = new global.FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        setTimeout(() => {          
          self.setState(prevState => {
            return {
              image: reader.result,
              profileId: prevState.profileId.split('?')[0] + '?date=' + Date.now()
            }
          })
        }, 500);
        local().put('/picture', {
          pic: reader.result
        }).then((res) => {
          if (res.data.success === false) store.addNotif(res.data.error, 'error')
        }).catch((err) => {
          if (err.response) {
            store.addNotif(err.response.data.error, 'error')
          }
        })
      }
      reader.onerror = function (error) {
        console.log('Error when reading image: ', error)
      }
    })
    if (rejectedFiles.length !== 0) {
      store.addNotif('This file is not allowed please use png < 1mb', 'error')
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

  feedInfo () {
    return (
      <Feed.Event>
        <Feed.Label icon='mail' />
        <Feed.Content>
          <Feed.Extra text>
            {this.state.profileMail}
          </Feed.Extra>
        </Feed.Content>
        <Feed.Label icon='user' />
        <Feed.Content>
          <Feed.Extra text>
            {this.state.profileFirtName}
          </Feed.Extra>
        </Feed.Content>
        <Feed.Content>
          <Feed.Extra text>
            {this.state.profileLastName}
          </Feed.Extra>
        </Feed.Content>
        <Feed.Content>
          <Feed.Extra text>
            {this.state.profileUserName}
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
    )
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
            <label>New password</label>
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
            <label>Repeat password</label>
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
        <Dropzone
          disablePreview
          className='dropzone backPic'
          accept='image/png'
          maxSize={1000000}
          onDrop={this.onDrop.bind(this)}>
          {this.state.profileId !== '' ? <div
            className='backPic'
            style={{backgroundImage: 'url(http://localhost:3005/picture/' + this.state.profileId + ')'}}
          /> : null}
        </Dropzone>
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
                {this.feedInfo()}
              </div>
            </Grid.Column>
          </Grid.Row>
          <Button.Group className='oklm'>
            { this.state.connectFacebook ? (
              <Button disabled
                color='facebook'
                onClick={() => {
                  window.location.href = `http://localhost:3005/auth/facebook?token=${global.localStorage.getItem('token')}`
                }}>
                <Icon name='facebook' /> FB
              </Button>
            ) : (
              <Button
                color='facebook'
                onClick={() => {
                  window.location.href = `http://localhost:3005/auth/facebook?token=${global.localStorage.getItem('token')}`
                }}>
                <Icon name='facebook' /> FB
              </Button>
            )
            }
            { this.state.connectGitHub ? (
              <Button disabled
                onClick={() => {
                  window.location.href = `http://localhost:3005/auth/github?token=${global.localStorage.getItem('token')}`
                }}>
                <Icon name='github' /> GitHub
              </Button>
            ) : (
              <Button
                onClick={() => {
                  window.location.href = `http://localhost:3005/auth/github?token=${global.localStorage.getItem('token')}`
                }}>
                <Icon name='github' /> GitHub
              </Button>
            )
            }
            { this.state.connectFortyTwo ? (
              <Button disabled
                onClick={() => {
                  window.location.href = `http://localhost:3005/auth/42?token=${global.localStorage.getItem('token')}`
                }}>
                <Icon name='code' /> 42
              </Button>
            ) : (
              <Button
                onClick={() => {
                  window.location.href = `http://localhost:3005/auth/42?token=${global.localStorage.getItem('token')}`
                }}>
                <Icon name='code' /> 42
              </Button>
            )
            }
          </Button.Group>
          <Button.Group size='large'>
            <Button onClick={() => { this.handleChangeLangue('en') }}>English</Button>
            <Button.Or />
            <Button onClick={() => { this.handleChangeLangue('fr') }}>French</Button>
          </Button.Group>
        </Grid>
      </div>
    )
  }
}

export default Profile
