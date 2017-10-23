import React from 'react'
import { Image, Icon } from 'semantic-ui-react'
import '../scss/profile.css'

class Profile extends React.Component {
  render () {
    return (
      <div>
        <div className='backPic'>
          <Image src='https://react.semantic-ui.com//assets/images/wireframe/square-image.png' className='profile' shape='circular' />
        </div>
          <Icon className='caret up' />
      </div>
    )
  }
}

export default Profile
