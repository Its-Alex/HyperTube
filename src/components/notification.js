import React, { Component } from 'react'
import { observer } from 'mobx-react'
import store from '../utils/store'

import '../scss/components/notification.css'

@observer
class notification extends Component {
  render () {
    return (
      <div id='notification'>
        <p>{store.notif}</p>
      </div>
    )
  }
}

export default notification
