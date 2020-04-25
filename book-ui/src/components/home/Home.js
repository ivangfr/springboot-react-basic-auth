import React, { Component } from 'react'
import { Statistic, Icon, Grid, Divider, Container, Segment } from 'semantic-ui-react'
import BookApi from '../misc/BookApi'

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
    this.setState({isLoadingNumberOfUsers: true})
    BookApi.get('/public/numberOfUsers')
      .then(response => {
        this.setState({ numberOfUsers: response.data })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        this.setState({isLoadingNumberOfUsers: false})
      })
  }

  getNumberOfBooks = () => {
    this.setState({getNumberOfBooks: true})
    BookApi.get('/public/numberOfBooks')
      .then(response => {
        this.setState({ numberOfBooks: response.data })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        this.setState({getNumberOfBooks: false})
      })
  }

  render() {
    const { isLoadingNumberOfUsers, numberOfUsers, isLoadingNumberOfBooks, numberOfBooks } = this.state
    return (
      <Container>
        <Divider hidden />
        <Grid centered columns={2}>
          <Grid.Column textAlign='center' width='4'>
            <Segment color='blue' loading={isLoadingNumberOfUsers}>
              <Statistic>
                <Statistic.Value><Icon name='user' color='blue' />{numberOfUsers}</Statistic.Value>
                <Statistic.Label>Users</Statistic.Label>
              </Statistic>
            </Segment>
          </Grid.Column>
          <Grid.Column textAlign='center' width='4'>
            <Segment color='blue' loading={isLoadingNumberOfBooks}>
              <Statistic>
                <Statistic.Value><Icon name='book' color='blue' />{numberOfBooks}</Statistic.Value>
                <Statistic.Label>Books</Statistic.Label>
              </Statistic>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}

export default Home