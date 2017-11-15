import React, { Component } from 'react'
import store from '../utils/store'
import { local } from '../utils/api'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import Dropzone from 'react-dropzone'
import { Button, Input, Icon, Image } from 'semantic-ui-react'

class Register extends Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      mail: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      image: '',
      loadingBtn: false
    }
    this._isMounted = false
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = _.debounce(this.handleSubmit.bind(this), 200)
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  componentWillMount () {
    this._isMounted = true
  }

  handleChange (evt) {
    if (this._isMounted === true) this.setState({[evt.target.name]: evt.target.value})
  }

  stackDebounce (e, data) {
    if (e.key === 'Enter' || (data && data.name === 'submit')) {
      if (this._isMounted === true) this.setState({loadingBtn: true})
    }
    this.handleSubmit(e.key, data)
  }

  handleSubmit (key, data) {
    if (key === 'Enter' || (data && data.name === 'submit')) {
      local().put('/user', {
        username: this.state.username,
        mail: this.state.mail,
        lastName: this.state.lastName,
        firstName: this.state.firstName,
        password: this.state.password,
        newPassword: this.state.confirmPassword,
        photo: this.state.image
      })
      .then(res => {
        if (res.data.success === true) {
          this.props.history.push('/login')
        } else {
          store.addNotif(res.data.error, 'error')
          if (this._isMounted === true) this.setState({loadingBtn: false})
        }
      })
      .catch(err => {
        if (this._isMounted === true) this.setState({loadingBtn: false})
        if (err.response) {
          store.addNotif(err.response.data.error, 'error')
        } else {
          store.addNotif('Somethings goes wrong :(', 'error')
        }
      })
    } else {
      if (this._isMounted === true) this.setState({loadingBtn: false})
    }
  }

  onDrop (acceptedFiles, rejectedFiles) {
    let self = this
    acceptedFiles.forEach(file => {
      var reader = new global.FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        self.setState({
          image: reader.result
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

  render () {
    return (
      <div id='register' >
        <h1 className='title centerMiddle'>Hypertube</h1>
        <video loop autoPlay muted id='background-video' className='register'>
          <source src='../olivier/MP4/Screens.mp4' type='video/mp4' />Your browser does not support the video tag. I suggest you upgrade your browser.
        </video>

        <div className='flexCenter'>
          <Dropzone
            disablePreview
            className='dropzone containerImgDrop'
            accept='image/png'
            maxSize={1000000}
            onDrop={this.onDrop.bind(this)}>
            {!this.state.image
            ? <Image src='../olivier/Movie-icon.png' size='small' className='centerMiddle' id='defaultPicture' />
            : <div className='containerImg'>
              <img src={this.state.image} alt='profile' className='previewImage' />
            </div>
            }
          </Dropzone>
          <Input
            type='text'
            placeholder='Username'
            name='username'
            label={{icon: 'user', className: 'label-login-btn', color: 'grey'}}
            className='input-login'
            value={this.state.username}
            onChange={this.handleChange}
            onKeyPress={this.stackDebounce.bind(this)}
          />
          <Input
            type='text'
            placeholder='Lastname'
            name='lastName'
            label={{icon: 'user', className: 'label-login-btn', color: 'grey'}}
            className='input-login'
            value={this.state.lastName}
            onChange={this.handleChange}
            onKeyPress={this.stackDebounce.bind(this)}
          />
          <Input
            type='text'
            placeholder='Firstname'
            name='firstName'
            label={{icon: 'user', className: 'label-login-btn', color: 'grey'}}
            className='input-login'
            value={this.state.firstName}
            onChange={this.handleChange}
            onKeyPress={this.stackDebounce.bind(this)}
          />
          <Input
            type='mail'
            placeholder='Mail'
            name='mail'
            label={{icon: 'inbox', className: 'label-login-btn', color: 'grey'}}
            className='input-login'
            value={this.state.mail}
            onChange={this.handleChange}
            onKeyPress={this.stackDebounce.bind(this)}
          />
          <Input
            type='password'
            placeholder='Password'
            name='password'
            label={{icon: 'lock', className: 'label-login-btn', color: 'grey'}}
            className='input-login'
            value={this.state.password}
            onChange={this.handleChange}
            onKeyPress={this.stackDebounce.bind(this)}
          />
          <Input
            type='password'
            placeholder='Password'
            name='confirmPassword'
            label={{icon: 'lock', className: 'label-login-btn', color: 'grey'}}
            className='input-login'
            value={this.state.confirmPassword}
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
            <Button.Content visible>Register</Button.Content>
            <Button.Content hidden>
              <Icon name='right arrow' />
            </Button.Content>
          </Button>
          <Link to='login'>Login</Link>
        </div>
      </div>
    )
  }
}

export default Register
