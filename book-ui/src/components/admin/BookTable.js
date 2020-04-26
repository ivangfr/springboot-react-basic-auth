import React from 'react'
import { Grid, Header, Form, Icon, Button, Image, Input, Segment, Table } from 'semantic-ui-react'

function BookTable({ isBooksLoading, books, bookIsbn, bookTitle, bookTextSearch, handleChange, addBook, deleteBook, searchBook }) {
  let bookList
  if (books.length === 0) {
    bookList = (
      <Table.Row key='no-book'>
        <Table.Cell collapsing textAlign='center' colSpan='4'>No book</Table.Cell>
      </Table.Row>
    )
  } else {
    bookList = books.map(book => {
      return (
        <Table.Row key={book.isbn}>
          <Table.Cell collapsing>
            <Button
              circular
              color='red'
              size='small'
              icon='trash'
              onClick={() => deleteBook(book.isbn)}
            />
          </Table.Cell>
          <Table.Cell>
            <Image src={`http://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`} size='tiny' bordered rounded />
          </Table.Cell>
          <Table.Cell>{book.isbn}</Table.Cell>
          <Table.Cell>{book.title}</Table.Cell>
        </Table.Row>
      )
    })
  }

  return (
    <Segment loading={isBooksLoading} color='orange'>
      <Grid stackable divided>
        <Grid.Row columns='3'>
          <Grid.Column width='3'>
            <Header as='h2'>
              <Icon name='book' />
              <Header.Content>Books</Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column width='5'>
            <Form onSubmit={searchBook}>
              <Input
                action={{ icon: 'search' }}
                id='bookTextSearch'
                placeholder='Search by ISBN or Title'
                value={bookTextSearch}
                onChange={handleChange}
              />
            </Form>
          </Grid.Column>
          <Grid.Column>
            <Form onSubmit={addBook}>
              <Form.Group>
                <Form.Field>
                  <Input
                    id='bookIsbn'
                    placeholder='ISBN'
                    value={bookIsbn}
                    onChange={handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Input
                    id='bookTitle'
                    placeholder='Title'
                    value={bookTitle}
                    onChange={handleChange}
                  />
                </Form.Field>
                <Button icon>
                  <Icon name='add' />
                </Button>
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table compact striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Cover</Table.HeaderCell>
            <Table.HeaderCell>ISBN</Table.HeaderCell>
            <Table.HeaderCell>Title</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {bookList}
        </Table.Body>
      </Table>
    </Segment>
  )
}

export default BookTable