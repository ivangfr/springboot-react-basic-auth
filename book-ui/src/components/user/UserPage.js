import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import BookList from './BookList'
import AuthContext from '../context/AuthContext'
import { bookApi } from '../misc/BookApi'

class UserPage extends Component {
  static contextType = AuthContext

  state = {
    books: [],
    bookTextSearch: '',
    isUser: true,
    isBooksLoading: false
  }

  componentDidMount() {
    const Auth = this.context
    const authUser = Auth.getUser()
    const isUser = authUser && JSON.parse(authUser).role === 'USER'
    this.setState({ isUser })

    this.getBooks()
  }

  handleChange = (e) => {
    const { id, value } = e.target
    this.setState({ [id]: value })
  }

  getBooks = () => {
    const Auth = this.context
    const authUser = Auth.getUser()

    this.setState({ isBooksLoading: true })
    bookApi.getBooks(authUser)
      .then(response => {
        this.setState({ books: response.data })
      })
      .catch(error => {
        console.log(error.response.data)
      })
      .finally(() => {
        this.setState({ isBooksLoading: false })
      })
  }

  searchBook = () => {
    const Auth = this.context
    const authUser = Auth.getUser()

    const text = this.state.bookTextSearch
    bookApi.searchBook(text, authUser)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          const books = data instanceof Array ? data : [data]
          this.setState({ books })
        } else {
          this.setState({ books: [] })
        }
      })
      .catch(error => {
        console.log(error.response.data)
        this.setState({ books: [] })
      })
  }

  render() {
    if (!this.state.isUser) {
      return <Redirect to='/' />
    } else {
      const { isBooksLoading, books, bookTextSearch } = this.state
      return (
        <Container style={{ marginTop: '4em' }}>
          <BookList
            isBooksLoading={isBooksLoading}
            bookTextSearch={bookTextSearch}
            books={books}
            handleChange={this.handleChange}
            searchBook={this.searchBook}
          />
        </Container>
      )
    }
  }
}

export default UserPage