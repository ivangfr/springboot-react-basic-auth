import React from 'react'
import { Grid, Table, ActionIcon, TextInput } from '@mantine/core'
import { IconTrash, IconSearch } from '@tabler/icons-react'
import BookForm from './BookForm'
import BookCover from '../misc/BookCover'

function BookTable({ books, bookIsbn, bookTitle, bookTextSearch, handleInputChange, handleAddBook, handleDeleteBook, handleSearchBook }) {
  let bookRows
  if (books.length === 0) {
    bookRows = (
      <Table.Tr key='no-book'>
        <Table.Td colSpan={4} style={{ textAlign: 'center' }}>No book</Table.Td>
      </Table.Tr>
    )
  } else {
    bookRows = books.map(book => (
      <Table.Tr key={book.isbn}>
        <Table.Td>
          <ActionIcon color='red' variant='filled' radius='xl' size='sm' onClick={() => handleDeleteBook(book.isbn)}>
            <IconTrash size={14} />
          </ActionIcon>
        </Table.Td>
        <Table.Td>
            <BookCover isbn={book.isbn} w={50} />
          </Table.Td>
        <Table.Td>{book.isbn}</Table.Td>
        <Table.Td>{book.title}</Table.Td>
      </Table.Tr>
    ))
  }

  return (
    <>
      <Grid mb='md'>
        <Grid.Col span={{ base: 12, sm: 5 }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSearchBook() }}>
            <TextInput
              name='bookTextSearch'
              placeholder='Search by ISBN or Title'
              value={bookTextSearch}
              onChange={handleInputChange}
              rightSection={
                <ActionIcon type='submit' variant='subtle'>
                  <IconSearch size={16} />
                </ActionIcon>
              }
            />
          </form>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 7 }}>
          <BookForm
            bookIsbn={bookIsbn}
            bookTitle={bookTitle}
            handleInputChange={handleInputChange}
            handleAddBook={handleAddBook}
          />
        </Grid.Col>
      </Grid>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40} />
            <Table.Th w={80}>Cover</Table.Th>
            <Table.Th>ISBN</Table.Th>
            <Table.Th>Title</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{bookRows}</Table.Tbody>
      </Table>
    </>
  )
}

export default BookTable
