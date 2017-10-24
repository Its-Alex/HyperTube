import React from 'react'
import { Input, Feed, Image, Grid, Icon, Modal, Button, Form } from 'semantic-ui-react'
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
  editUser () {
    return (
      <Form className='editForm'>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>First name</label>
            <Input id='firstname' placeholder='First name' />
          </Form.Field>
          <Form.Field>
            <label>Last name</label>
            <Input id='lastname' placeholder='Last name' />
          </Form.Field>
          <Form.Field>
            <label>Login</label>
            <Input id='login' placeholder='Login' />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Email</label>
            <Input id='email' type='email' placeholder='Email' />
          </Form.Field>
          <Form.Field>
            <label>Old password</label>
            <Input id='oldpswd' type='password' placeholder='Old password' />
          </Form.Field>
          <Form.Field>
            <label>New password</label>
            <Input id='newpswd' type='password' placeholder='Last name' />
          </Form.Field>
        </Form.Group>
      </Form>
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
                header='Edit your Profile !'
                content={this.editUser()}
                actions={[
                  'Snooze',
                  { key: 'done', content: 'Done', positive: true }
                ]}
              />
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

export default Profile
