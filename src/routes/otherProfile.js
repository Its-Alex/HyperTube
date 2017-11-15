import React, { Component } from 'react'
import store from '../utils/store'
import { Feed, Grid } from 'semantic-ui-react'
import { local } from '../utils/api.js'

class OtherProfile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      profileFirstName: '',
      profileLastName: '',
      profileMail: '',
      profileUserName: ''
    }
    this._isMounted = false
  }

  componentWillMount () {
    this._isMounted = true
    local().get(`user/${this.props.match.params.id}`
    ).then((res) => {
      if (this._isMounted === true) {
        this.setState({
          profileFirstName: res.data.user.firstName,
          profileLastName: res.data.user.lastName,
          profileMail: res.data.user.mail,
          profileUserName: res.data.user.username
        })
      }
    }).catch((err) => {
      if (err.response) {
        store.addNotif(err.response.data.error, 'error')
      }
    })
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  feedEmail () {
    return (
      <Feed.Event>
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
  render () {
    return (
      <div>
        {this.state.profileId !== '' ? <div
          className='backPic'
          style={{backgroundImage: 'url(http://localhost:3005/picture/' + this.props.match.params.id + ')'}}
        /> : null}
        <Grid celled='internally'>
          <Grid.Row>
            <Grid.Column width={12} textAlign='center'>
              <div className='userName'>
                {this.state.profileFirstName}
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

export default OtherProfile
