import React, { Component } from 'react'
// import { Item, Label } from 'semantic-ui-react'
import '../scss/item.css'

class Iteme extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  render () {
    return (
      <div>
        <div className='bodytest'>
          <div className='content'>
            <div className='inside'>
              <div className='imgcontent'>
                <img src='https://www.ecranlarge.com/uploads/image/000/963/full-metal-jacket-affiche-963183.jpg' alt='Girl in a jacket' />
              </div>
            </div>
          </div>
          <div className='content'>
            <div className='inside'>
              <div className='imgcontent'>
                <img src='https://www.ecranlarge.com/uploads/image/000/963/full-metal-jacket-affiche-963183.jpg' alt='Girl in a jacket' />
              </div>
            </div>
          </div>
          <div className='content'>
            <div className='imgcontent'>
              <img src='https://www.ecranlarge.com/uploads/image/000/963/full-metal-jacket-affiche-963183.jpg' alt='Girl in a jacket' />
            </div>
          </div>
          <div className='content'>
            <div className='imgcontent'>
              <img src='https://www.ecranlarge.com/uploads/image/000/963/full-metal-jacket-affiche-963183.jpg' alt='Girl in a jacket' />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Iteme
