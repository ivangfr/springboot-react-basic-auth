import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Container, Divider } from 'semantic-ui-react'
import UserTable from './UserTable'
import AuthContext from '../context/AuthContext'
import BookApi from '../misc/BookApi'
import BookTable from './BookTable'

class AdminPage extends Component {
  static contextType = AuthContext

  state = {
    users: [],
    books: [],
    bookIsbn: '',
    bookTitle: '',
    bookIsbnSearch: '',
    userUsernameSearch: '',
    isAdmin: true,
    isUsersLoading: false,
    isBooksLoading: false,
  }

  componentDidMount() {
    const { getUser } = this.context
    const user = getUser()
    const isAdmin = user && JSON.parse(user).role === 'ADMIN'
    this.setState({ isAdmin })

    this.getUsers()
    this.getBooks()
  }

  handleChange = (e) => {
    const { id, value } = e.target
    this.setState({ [id]: value })
  }

  getUsers = () => {
    const { getUser } = this.context
    const user = getUser()

    this.setState({ isUsersLoading: true })
    BookApi.get('/api/users', {
      headers: {
        'Authorization': 'Basic ' + JSON.parse(user).authdata
      }
    })
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
    const { getUser } = this.context
    const user = getUser()
    BookApi.delete('/api/users/' + username, {
      headers: {
        'Authorization': 'Basic ' + JSON.parse(user).authdata
      }
    })
      .then(() => {
        this.getUsers()
      })
      .catch(error => {
        console.log(error)
      })
  }

  searchUser = () => {
    const { getUser } = this.context
    const user = getUser()

    const username = this.state.userUsernameSearch
    const url = username ? '/api/users/' + username : '/api/users'
    BookApi.get(url, {
      headers: {
        'Authorization': 'Basic ' + JSON.parse(user).authdata
      }
    })
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

  deleteBook = (isbn) => {
    const { getUser } = this.context
    const user = getUser()
    BookApi.delete('/api/books/' + isbn, {
      headers: {
        'Authorization': 'Basic ' + JSON.parse(user).authdata
      }
    })
      .then(() => {
        this.getBooks()
      })
      .catch(error => {
        console.log(error)
      })
  }

  addBook = () => {
    const { getUser } = this.context
    const user = getUser()

    const { bookIsbn, bookTitle } = this.state
    if (!(bookIsbn && bookTitle)) {
      console.log('empty fields')
      return
    }

    const book = { isbn: bookIsbn, title: bookTitle }
    BookApi.post('/api/books', book, {
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Basic ' + JSON.parse(user).authdata
      }
    })
      .then(() => {
        this.clearBookForm()
        this.getBooks()
      })
      .catch(error => {
        console.log(error)
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
    console.log('clear form')
    this.setState({
      bookIsbn: '',
      bookTitle: ''
    })
  }

  render() {
    const {
      isAdmin, isUsersLoading, users, userUsernameSearch,
      isBooksLoading, books, bookIsbn, bookTitle, bookIsbnSearch
    } = this.state
    if (!isAdmin) {
      return <Redirect to='/' />
    } else {
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
            bookIsbnSearch={bookIsbnSearch}
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