import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import BookList from './BookList'
import { useAuth } from '../context/AuthContext'
import { bookApi } from '../misc/BookApi'
import { handleLogError } from '../misc/Helpers'

function UserPage() {
  const Auth = useAuth()
  const user = Auth.getUser()
  const isUser = user.role === 'USER'

  const [books, setBooks] = useState([])
  const [bookTextSearch, setBookTextSearch] = useState('')
  const [isBooksLoading, setIsBooksLoading] = useState(false)

  useEffect(() => {
    handleGetBooks()
  }, [])

  const handleInputChange = (e, { name, value }) => {
    if (name === 'bookTextSearch') {
      setBookTextSearch(value)
    }
  }

  const handleGetBooks = async () => {
    try {
      setIsBooksLoading(true)
      const response = await bookApi.getBooks(user)
      setBooks(response.data)
    } catch (error) {
      handleLogError(error)
    } finally {
      setIsBooksLoading(false)
    }
  }

  const handleSearchBook = async () => {
    try {
      const response = await bookApi.getBooks(user, bookTextSearch)
      const books = response.data
      setBooks(books)
    } catch (error) {
      handleLogError(error)
      setBooks([])
    }
  }

  if (!isUser) {
    return <Navigate to='/' />
  }

  return (
    <Container>
      <BookList
        isBooksLoading={isBooksLoading}
        bookTextSearch={bookTextSearch}
        books={books}
        handleInputChange={handleInputChange}
        handleSearchBook={handleSearchBook}
      />
    </Container>
  )
}

export default UserPage