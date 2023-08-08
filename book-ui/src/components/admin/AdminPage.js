import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import AuthContext from '../context/AuthContext'
import { bookApi } from '../misc/BookApi'
import AdminTab from './AdminTab'
import { handleLogError } from '../misc/Helpers'

class AdminPage extends Component {
  static contextType = AuthContext

  state = {
    users: [],
    books: [],
    bookIsbn: '',
    bookTitle: '',
    bookTextSearch: '',
    userUsernameSearch: '',
    isAdmin: true,
    isUsersLoading: false,
    isBooksLoading: false,
  }

  componentDidMount() {
    const Auth = this.context
    const user = Auth.getUser()
    const isAdmin = user.role === 'ADMIN'
    this.setState({ isAdmin })

    this.handleGetUsers()
    this.handleGetBooks()
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  handleGetUsers = async () => {
    try {
      const user = this.context.getUser()

      this.setState({ isUsersLoading: true })

      const response = await bookApi.getUsers(user)
      const users = response.data

      this.setState({ users })
    } catch (error) {
      handleLogError(error)
    } finally {
      this.setState({ isUsersLoading: false })
    }
  }

  handleDeleteUser = async (username) => {
    try {
      const user = this.context.getUser()

      await bookApi.deleteUser(user, username)
      await this.handleGetUsers()
    } catch (error) {
      handleLogError(error)
    }
  }

  handleSearchUser = async () => {
    try {
      const user = this.context.getUser()

      const username = this.state.userUsernameSearch
      const response = await bookApi.getUsers(user, username)

      const data = response.data
      const users = data instanceof Array ? data : [data]
      this.setState({ users })
    } catch (error) {
      handleLogError(error)
      this.setState({ users: [] })
    }
  }

  handleGetBooks = async () => {
    try {
      const user = this.context.getUser()

      this.setState({ isBooksLoading: true })
      const response = await bookApi.getBooks(user)

      this.setState({ books: response.data, isBooksLoading: false })
    } catch (error) {
      handleLogError(error)
      this.setState({ isBooksLoading: false })
    }
  }

  handleDeleteBook = async (isbn) => {
    try {
      const user = this.context.getUser()

      await bookApi.deleteBook(user, isbn)
      this.handleGetBooks()
    } catch (error) {
      handleLogError(error)
    }
  }

  handleAddBook = async () => {
    try {
      const user = this.context.getUser()

      let { bookIsbn, bookTitle } = this.state
      bookIsbn = bookIsbn.trim()
      bookTitle = bookTitle.trim()

      if (!(bookIsbn && bookTitle)) {
        return
      }

      const book = { isbn: bookIsbn, title: bookTitle }
      await bookApi.addBook(user, book)
      this.clearBookForm()
      this.handleGetBooks()
    } catch (error) {
      handleLogError(error)
    }
  }

  handleSearchBook = async () => {
    try {
      const user = this.context.getUser()
      const text = this.state.bookTextSearch

      const response = await bookApi.getBooks(user, text)
      const books = response.data

      this.setState({ books })
    } catch (error) {
      handleLogError(error)
      this.setState({ books: [] })
    }
  }

  clearBookForm = () => {
    this.setState({
      bookIsbn: '',
      bookTitle: ''
    })
  }

  render() {
    if (!this.state.isAdmin) {
      return <Navigate to='/' />
    }

    const { isUsersLoading, users, userUsernameSearch, isBooksLoading, books, bookIsbn, bookTitle, bookTextSearch } = this.state
    return (
      <Container>
        <AdminTab
          isUsersLoading={isUsersLoading}
          users={users}
          userUsernameSearch={userUsernameSearch}
          handleDeleteUser={this.handleDeleteUser}
          handleSearchUser={this.handleSearchUser}
          isBooksLoading={isBooksLoading}
          books={books}
          bookIsbn={bookIsbn}
          bookTitle={bookTitle}
          bookTextSearch={bookTextSearch}
          handleAddBook={this.handleAddBook}
          handleDeleteBook={this.handleDeleteBook}
          handleSearchBook={this.handleSearchBook}
          handleInputChange={this.handleInputChange}
        />
      </Container>
    )
  }
}

export default AdminPage