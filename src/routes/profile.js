import React from 'react'
import { Image } from 'semantic-ui-react'
import '../scss/profile.scss'

class Profile extends React.Component {
  render () {
    return (
      <div>
        <Image src='https://react.semantic-ui.com//assets/images/wireframe/square-image.png' className='profile' shape='circular' />
      </div>
    )
  }
}

export default Profile
