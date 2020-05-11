import React, { Component } from 'react'
import { Statistic, Icon, Grid, Container, Image, Segment, Dimmer, Loader } from 'semantic-ui-react'
import { bookApi } from '../misc/BookApi'
import { handleLogError } from '../misc/Helpers'

class Home extends Component {
  state = {
    numberOfUsers: 0,
    numberOfBooks: 0,
    isLoading: false
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    try {
      let response = await bookApi.numberOfUsers()
      const numberOfUsers = response.data

      response = await bookApi.numberOfBooks()
      const numberOfBooks = response.data

      this.setState({ numberOfUsers, numberOfBooks })
    } catch (error) {
      handleLogError(error)
    } finally {
      this.setState({ isLoading: false })
    }
  }

  render() {
    const { isLoading } = this.state
    if (isLoading) {
      return (
        <Segment basic style={{ marginTop: window.innerHeight / 2 }}>
          <Dimmer active inverted>
            <Loader inverted size='huge'>Loading</Loader>
          </Dimmer>
        </Segment>
      )
    } else {
      const { numberOfUsers, numberOfBooks } = this.state
      return (
        <Container text>
          <Grid stackable columns={2}>
            <Grid.Row>
              <Grid.Column textAlign='center'>
                <Segment color='blue'>
                  <Statistic>
                    <Statistic.Value><Icon name='user' color='grey' />{numberOfUsers}</Statistic.Value>
                    <Statistic.Label>Users</Statistic.Label>
                  </Statistic>
                </Segment>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Segment color='blue'>
                  <Statistic>
                    <Statistic.Value><Icon name='book' color='grey' />{numberOfBooks}</Statistic.Value>
                    <Statistic.Label>Books</Statistic.Label>
                  </Statistic>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' style={{ marginTop: '2em' }} />
          <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' style={{ marginTop: '2em' }} />
        </Container>
      )
    }
  }
}

export default Home