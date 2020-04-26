import axios from 'axios'

export const bookApi = {
  authenticate,
  signup,
  numberOfUsers,
  numberOfBooks,
  getUsers,
  deleteUser,
  searchUser,
  getBooks,
  deleteBook,
  addBook,
  searchBook
}

function authenticate(username, password) {
  return instance.post('/auth/authenticate', { username, password }, {
    headers: { 'Content-type': 'application/json' }
  })
}

function signup(user) {
  return instance.post('/auth/signup', user, {
    headers: { 'Content-type': 'application/json' }
  })
}

function numberOfUsers() {
  return instance.get('/public/numberOfUsers');
}

function numberOfBooks() {
  return instance.get('/public/numberOfBooks');
}

function getUsers(authUser) {
  return instance.get('/api/users', {
    headers: { 'Authorization': basicAuth(authUser) }
  })
}

function deleteUser(username, authUser) {
  return instance.delete('/api/users/' + username, {
    headers: { 'Authorization': basicAuth(authUser) }
  })
}

function searchUser(username, authUser) {
  const url = username ? '/api/users/' + username : '/api/users'
  return instance.get(url, {
    headers: { 'Authorization': basicAuth(authUser) }
  })
}

function getBooks(authUser) {
  return instance.get('/api/books', {
    headers: { 'Authorization': basicAuth(authUser) }
  })
}

function deleteBook(isbn, authUser) {
  return instance.delete('/api/books/' + isbn, {
    headers: { 'Authorization': basicAuth(authUser) }
  })
}

function addBook(book, authUser) {
  return instance.post('/api/books', book, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': basicAuth(authUser)
    }
  })
}

function searchBook(text, authUser) {
  const url = '/api/books?text=' + text
  return instance.get(url, {
    headers: { 'Authorization': basicAuth(authUser) }
  })
}

// -- Axios

const instance = axios.create({
  baseURL: 'http://localhost:8080'
})

// -- Helper functions

function basicAuth(authUser) {
  return 'Basic ' + JSON.parse(authUser).authdata
}