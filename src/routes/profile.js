import React from 'react'
import { Image, Grid, Icon, Modal, Button } from 'semantic-ui-react'
import '../scss/profile.css'

class Profile extends React.Component {
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
  render () {
    return (
      <div>
        <div className='backPic'>
          <Image src='https://react.semantic-ui.com//assets/images/wireframe/square-image.png' className='profile' shape='circular' />
        </div>
        <Grid celled='internally'>
          <Grid.Row>
            <Grid.Column width={12} textAlign='center'>
              <Modal
                trigger={this.editProfile()}
                header='Reminder!'
                content='Call Benjamin regarding the reports.'
                actions={[
                  'Snooze',
                  { key: 'done', content: 'Done', positive: true }
                ]}
              />
              <div className='userName'>
                Thomas Giraud
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default Profile
