import React, { Component } from 'react'
import { observer } from 'mobx-react'
import store from '../utils/store'

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
