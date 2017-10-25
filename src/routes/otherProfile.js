import React, { Component } from 'react'
import { Feed, Image, Grid } from 'semantic-ui-react'

class OtherProfile extends Component {
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
  render () {
    return (
      <div>
        <div className='backPic'>
          <Image src='https://react.semantic-ui.com//assets/images/wireframe/square-image.png' className='profile' shape='circular' />
        </div>
        <Grid celled='internally'>
          <Grid.Row>
            <Grid.Column width={12} textAlign='center'>
              <div className='userName'>
                Thomas Giraud
              </div>
              <div className='userLogin'>
                wickedpool
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
