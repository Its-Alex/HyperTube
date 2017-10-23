import React, { Component } from 'react'
// import { Item, Label } from 'semantic-ui-react'
import '../scss/item.css'
import axios from 'axios'

class Iteme extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  
  componentWillMount () {
    axios.get('https://api.themoviedb.org/3/search/movie?api_key=4add767f00472cadffc84346bd8572e6&query=Jack+Reacher').then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }
  

  render () {
    return (
      <div>
        <div className='bodytest'>
          <div className='container'>
            <div className='imgcontent'>
              <img src='https://www.ecranlarge.com/uploads/image/000/963/full-metal-jacket-affiche-963183.jpg' alt='Girl in a jacket' />
            </div>
            <div className='description'>
              <div className='titre'>
                la je met le titre
              </div>
              <div className='resumer'>
                lale resumer resumer
              </div>
              <div className='note'>
                la la note
              </div>
            </div>
          </div>
          <div className='container'>
            <div className='inside'>
              <div className='imgcontent'>
                <img src='https://www.ecranlarge.com/uploads/image/000/963/full-metal-jacket-affiche-963183.jpg' alt='Girl in a jacket' />
              </div>
            </div>
          </div>
          <div className='container'>
            <div className='imgcontent'>
              <img src='https://www.ecranlarge.com/uploads/image/000/963/full-metal-jacket-affiche-963183.jpg' alt='Girl in a jacket' />
            </div>
          </div>
          <div className='container'>
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
