import React, { Component } from 'react'
import { Statistic, Icon, Grid, Container, Image, Segment } from 'semantic-ui-react'
import { bookApi } from '../misc/BookApi'

class Home extends Component {
  state = {
    numberOfUsers: 0,
    numberOfBooks: 0,
    isLoadingNumberOfUsers: false,
    isLoadingNumberOfBooks: false,
  }

  componentDidMount() {
    this.getNumberOfUsers()
    this.getNumberOfBooks()
  }

  getNumberOfUsers = () => {
    this.setState({ isLoadingNumberOfUsers: true })
    bookApi.numberOfUsers()
      .then(response => {
        this.setState({ numberOfUsers: response.data })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        this.setState({ isLoadingNumberOfUsers: false })
      })
  }

  getNumberOfBooks = () => {
    this.setState({ getNumberOfBooks: true })
    bookApi.numberOfBooks()
      .then(response => {
        this.setState({ numberOfBooks: response.data })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        this.setState({ getNumberOfBooks: false })
      })
  }

  render() {
    const { isLoadingNumberOfUsers, numberOfUsers, isLoadingNumberOfBooks, numberOfBooks } = this.state
    return (
      <Container text>
        <Grid stackable columns={2}>
          <Grid.Row>
            <Grid.Column textAlign='center'>
              <Segment color='blue' loading={isLoadingNumberOfUsers}>
                <Statistic>
                  <Statistic.Value><Icon name='user' color='grey' />{numberOfUsers}</Statistic.Value>
                  <Statistic.Label>Users</Statistic.Label>
                </Statistic>
              </Segment>
            </Grid.Column>
            <Grid.Column textAlign='center'>
              <Segment color='blue' loading={isLoadingNumberOfBooks}>
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

export default Home