import React from 'react'
import { Tab } from 'semantic-ui-react'
import UserTable from './UserTable'
import BookTable from './BookTable'

function AdminTab(props) {
  const { handleChange } = props
  const { isUsersLoading, users, userUsernameSearch, deleteUser, searchUser } = props
  const { isBooksLoading, books, bookIsbn, bookTitle, bookTextSearch, addBook, deleteBook, searchBook } = props

  const panes = [
    {
      menuItem: { key: 'users', icon: 'users', content: 'Users' },
      render: () => (
        <Tab.Pane loading={isUsersLoading}>
          <UserTable
            users={users}
            userUsernameSearch={userUsernameSearch}
            handleChange={handleChange}
            deleteUser={deleteUser}
            searchUser={searchUser}
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: { key: 'books', icon: 'book', content: 'Books' },
      render: () => (
        <Tab.Pane loading={isBooksLoading}>
          <BookTable
            books={books}
            bookIsbn={bookIsbn}
            bookTitle={bookTitle}
            bookTextSearch={bookTextSearch}
            handleChange={handleChange}
            addBook={addBook}
            deleteBook={deleteBook}
            searchBook={searchBook}
          />
        </Tab.Pane>
      )
    }
  ]

  return (
    <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
  )
}

export default AdminTab