import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

class Movie extends Component {
  render () {
    return (
      <div>
        <Button.Group>
          <Button>One</Button>
          <Button.Or />
          <Button>Two</Button>
          <Button.Or />
          <Button>Three</Button>
        </Button.Group>
      </div>
    )
  }
}

export default Movie
