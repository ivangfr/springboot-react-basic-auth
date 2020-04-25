import React from 'react'
import { Grid, Header, Form, Icon, Input, Button, List, Segment } from 'semantic-ui-react'

function BookList({ isBooksLoading, bookIsbnSearch, books, handleChange, searchBook }) {
  let bookList
  if (books.length === 0) {
    bookList = <List.Item key='no-book'>No book</List.Item>
  } else {
    bookList = books.map(book => {
      return (
        <List.Item key={book.isbn}>
          <Icon name='book' size='big' color='teal' />
          <List.Content>
            <List.Header>{book.title}</List.Header>
            <List.Description>ISBN: {book.isbn}</List.Description>
          </List.Content>
        </List.Item>
      )
    })
  }

  return (
    <Segment loading={isBooksLoading} color='teal'>
      <Grid stackable divided>
        <Grid.Row columns='2'>
          <Grid.Column width='3'>
            <Header as='h2'>
              <Icon name='book' />
              <Header.Content>Books</Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column>
            <Form onSubmit={searchBook}>
              <Form.Group>
                <Form.Field>
                  <Input
                    id='bookIsbnSearch'
                    placeholder='Search by ISBN'
                    value={bookIsbnSearch}
                    onChange={handleChange}
                  />
                </Form.Field>
                <Button icon>
                  <Icon name='search' />
                </Button>
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <List relaxed='very' verticalAlign='middle' size='large'>
        {bookList}
      </List>
    </Segment>
  )
}

export default BookList