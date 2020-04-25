import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import BookList from './BookList'
import AuthContext from '../context/AuthContext'
import BookApi from '../misc/BookApi'

class UserPage extends Component {
  static contextType = AuthContext

  state = {
    books: [],
    bookIsbnSearch: '',
    isBooksLoading: false
  }

  componentDidMount() {
    this.getBooks()
  }

  handleChange = (e) => {
    const { id, value } = e.target
    this.setState({ [id]: value })
  }

  getBooks = () => {
    const { getUser } = this.context
    const user = getUser()

    this.setState({ isBooksLoading: true })
    BookApi.get('/api/books', {
      headers: {
        'Authorization': 'Basic ' + JSON.parse(user).authdata
      }
    })
      .then(response => {
        this.setState({ books: response.data })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        this.setState({ isBooksLoading: false })
      })
  }

  searchBook = () => {
    const { getUser } = this.context
    const user = getUser()

    const isbn = this.state.bookIsbnSearch
    const url = isbn ? '/api/books/' + isbn : '/api/books'
    BookApi.get(url, {
      headers: {
        'Authorization': 'Basic ' + JSON.parse(user).authdata
      }
    })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          const books = data instanceof Array ? data : [data]
          this.setState({ books })
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ books: [] })
      })
  }

  render() {
    const { isBooksLoading, books, bookIsbnSearch } = this.state
    return (
      <Container>
        <BookList
          isBooksLoading={isBooksLoading}
          bookIsbnSearch={bookIsbnSearch}
          books={books}
          handleChange={this.handleChange}
          searchBook={this.searchBook}
        />
      </Container>
    )
  }
}

export default UserPage