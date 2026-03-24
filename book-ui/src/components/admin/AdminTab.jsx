import { Tabs, LoadingOverlay, Box } from '@mantine/core'
import { IconUsers, IconBook } from '@tabler/icons-react'
import UserTable from './UserTable'
import BookTable from './BookTable'

function AdminTab(props) {
  const { handleInputChange } = props
  const { isUsersLoading, users, userUsernameSearch, handleDeleteUser, handleSearchUser } = props
  const { isBooksLoading, books, bookIsbn, bookTitle, bookTextSearch, handleAddBook, handleDeleteBook, handleSearchBook } = props

  return (
    <Tabs defaultValue='users' mt='md'>
      <Tabs.List>
        <Tabs.Tab value='users' leftSection={<IconUsers size={16} />}>Users</Tabs.Tab>
        <Tabs.Tab value='books' leftSection={<IconBook size={16} />}>Books</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value='users' pt='md'>
        <Box pos='relative'>
          <LoadingOverlay visible={isUsersLoading} />
          <UserTable
            users={users}
            userUsernameSearch={userUsernameSearch}
            handleInputChange={handleInputChange}
            handleDeleteUser={handleDeleteUser}
            handleSearchUser={handleSearchUser}
          />
        </Box>
      </Tabs.Panel>

      <Tabs.Panel value='books' pt='md'>
        <Box pos='relative'>
          <LoadingOverlay visible={isBooksLoading} />
          <BookTable
            books={books}
            bookIsbn={bookIsbn}
            bookTitle={bookTitle}
            bookTextSearch={bookTextSearch}
            handleInputChange={handleInputChange}
            handleAddBook={handleAddBook}
            handleDeleteBook={handleDeleteBook}
            handleSearchBook={handleSearchBook}
          />
        </Box>
      </Tabs.Panel>
    </Tabs>
  )
}

export default AdminTab
