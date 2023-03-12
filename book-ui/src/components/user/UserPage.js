import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import BookList from './BookList'
import AuthContext from '../context/AuthContext'
import { bookApi } from '../misc/BookApi'
import { handleLogError } from '../misc/Helpers'

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
    const user = Auth.getUser()
    const isUser = user.role === 'USER'
    this.setState({ isUser })

    this.handleGetBooks()
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  handleGetBooks = () => {
    const Auth = this.context
    const user = Auth.getUser()

    this.setState({ isBooksLoading: true })
    bookApi.getBooks(user)
      .then(response => {
        this.setState({ books: response.data })
      })
      .catch(error => {
        handleLogError(error)
      })
      .finally(() => {
        this.setState({ isBooksLoading: false })
      })
  }

  handleSearchBook = () => {
    const Auth = this.context
    const user = Auth.getUser()

    const text = this.state.bookTextSearch
    bookApi.getBooks(user, text)
      .then(response => {
        const books = response.data
        this.setState({ books })
      })
      .catch(error => {
        handleLogError(error)
        this.setState({ books: [] })
      })
  }

  render() {
    if (!this.state.isUser) {
      return <Navigate to='/' />
    } else {
      const { isBooksLoading, books, bookTextSearch } = this.state
      return (
        <Container>
          <BookList
            isBooksLoading={isBooksLoading}
            bookTextSearch={bookTextSearch}
            books={books}
            handleInputChange={this.handleInputChange}
            handleSearchBook={this.handleSearchBook}
          />
        </Container>
      )
    }
  }
}

export default UserPage