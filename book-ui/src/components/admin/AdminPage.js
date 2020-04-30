import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Container, Divider } from 'semantic-ui-react'
import UserTable from './UserTable'
import AuthContext from '../context/AuthContext'
import BookTable from './BookTable'
import { bookApi } from '../misc/BookApi'

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

    this.getUsers()
    this.getBooks()
  }

  handleChange = (e) => {
    const { id, value } = e.target
    this.setState({ [id]: value })
  }

  getUsers = () => {
    const Auth = this.context
    const user = Auth.getUser()

    this.setState({ isUsersLoading: true })
    bookApi.getUsers(user)
      .then(response => {
        this.setState({ users: response.data })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        this.setState({ isUsersLoading: false })
      })
  }

  deleteUser = (username) => {
    const Auth = this.context
    const user = Auth.getUser()

    bookApi.deleteUser(username, user)
      .then(() => {
        this.getUsers()
      })
      .catch(error => {
        console.log(error)
      })
  }

  searchUser = () => {
    const Auth = this.context
    const user = Auth.getUser()

    const username = this.state.userUsernameSearch
    bookApi.searchUser(username, user)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          const users = data instanceof Array ? data : [data]
          this.setState({ users })
        } else {
          this.setState({ users: [] })
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ users: [] })
      })
  }

  getBooks = () => {
    const Auth = this.context
    const user = Auth.getUser()

    this.setState({ isBooksLoading: true })
    bookApi.getBooks(user)
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

  deleteBook = (isbn) => {
    const Auth = this.context
    const user = Auth.getUser()

    bookApi.deleteBook(isbn, user)
      .then(() => {
        this.getBooks()
      })
      .catch(error => {
        console.log(error)
      })
  }

  addBook = () => {
    const Auth = this.context
    const user = Auth.getUser()

    const { bookIsbn, bookTitle } = this.state
    if (!(bookIsbn && bookTitle)) {
      return
    }

    const book = { isbn: bookIsbn, title: bookTitle }
    bookApi.addBook(book, user)
      .then(() => {
        this.clearBookForm()
        this.getBooks()
      })
      .catch(error => {
        console.log(error)
      })
  }

  searchBook = () => {
    const Auth = this.context
    const user = Auth.getUser()

    const text = this.state.bookTextSearch
    bookApi.searchBook(text, user)
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
        console.log(error)
        this.setState({ books: [] })
      })
  }

  clearBookForm = () => {
    this.setState({
      bookIsbn: '',
      bookTitle: ''
    })
  }

  render() {
    if (!this.state.isAdmin) {
      return <Redirect to='/' />
    } else {
      const { isUsersLoading, users, userUsernameSearch, isBooksLoading, books, bookIsbn, bookTitle, bookTextSearch } = this.state
      return (
        <Container>
          <UserTable
            isUsersLoading={isUsersLoading}
            users={users}
            userUsernameSearch={userUsernameSearch}
            handleChange={this.handleChange}
            deleteUser={this.deleteUser}
            searchUser={this.searchUser}
          />
          <Divider section />
          <BookTable
            isBooksLoading={isBooksLoading}
            books={books}
            bookIsbn={bookIsbn}
            bookTitle={bookTitle}
            bookTextSearch={bookTextSearch}
            handleChange={this.handleChange}
            addBook={this.addBook}
            deleteBook={this.deleteBook}
            searchBook={this.searchBook}
          />
        </Container>
      )
    }
  }
}

export default AdminPage