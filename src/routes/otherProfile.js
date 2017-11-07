import React, { Component } from 'react'
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
  }

  componentWillMount () {
    local().get(`user/${this.props.match.params.id}`
    ).then((res) => {
      console.log(res)
      this.setState({
        profileFirstName: res.data.user.firstName,
        profileLastName: res.data.user.lastName,
        profileMail: res.data.user.mail,
        profileUserName: res.data.user.username
      })
    }).catch((err) => {
      console.log(err.response)
    })
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
