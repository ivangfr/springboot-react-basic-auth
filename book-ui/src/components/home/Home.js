import React, { Component } from 'react'
import { Statistic, Icon, Grid } from 'semantic-ui-react'
import BookApi from '../misc/BookApi'

class Home extends Component {
  state = {
    numberOfUsers: 0,
    numberOfBooks: 0
  }

  componentDidMount() {
    this.getNumberOfUsers()
    this.getNumberOfBooks()
  }

  getNumberOfUsers = () => {
    BookApi.get('/public/numberOfUsers')
      .then(response => {
        this.setState({ numberOfUsers: response.data })
      })
      .catch(error => {
        console.log(error)
      })
  }

  getNumberOfBooks = () => {
    BookApi.get('/public/numberOfBooks')
      .then(response => {
        this.setState({ numberOfBooks: response.data })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    const { numberOfUsers, numberOfBooks } = this.state
    return (
      <div>
        <Grid textAlign='center'>
          <Statistic.Group>
            <Statistic>
              <Statistic.Value><Icon name='user' color='blue' />{numberOfUsers}</Statistic.Value>
              <Statistic.Label>Users</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value><Icon name='book' color='blue' />{numberOfBooks}</Statistic.Value>
              <Statistic.Label>Books</Statistic.Label>
            </Statistic>
          </Statistic.Group>
        </Grid>
      </div>
    )
  }
}

export default Home