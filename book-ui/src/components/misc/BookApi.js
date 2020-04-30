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

function getUsers(user) {
  return instance.get('/api/users', {
    headers: { 'Authorization': basicAuth(user) }
  })
}

function deleteUser(username, user) {
  return instance.delete('/api/users/' + username, {
    headers: { 'Authorization': basicAuth(user) }
  })
}

function searchUser(username, user) {
  const url = username ? '/api/users/' + username : '/api/users'
  return instance.get(url, {
    headers: { 'Authorization': basicAuth(user) }
  })
}

function getBooks(user) {
  return instance.get('/api/books', {
    headers: { 'Authorization': basicAuth(user) }
  })
}

function deleteBook(isbn, user) {
  return instance.delete('/api/books/' + isbn, {
    headers: { 'Authorization': basicAuth(user) }
  })
}

function addBook(book, user) {
  return instance.post('/api/books', book, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': basicAuth(user)
    }
  })
}

function searchBook(text, user) {
  const url = '/api/books?text=' + text
  return instance.get(url, {
    headers: { 'Authorization': basicAuth(user) }
  })
}

// -- Axios

const instance = axios.create({
  baseURL: 'http://localhost:8080'
})

// -- Helper functions

function basicAuth(user) {
  return 'Basic ' + user.authdata
}